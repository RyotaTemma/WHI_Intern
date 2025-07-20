"use client";
import { useState, useEffect } from "react";
import { 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Alert,
  Divider,
  Collapse,
  IconButton,
  Autocomplete,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import { Employee } from "../models/Employee";
import useSWR from "swr";
import { isLeft } from "fp-ts/Either";
import * as t from "io-ts";
import { useTranslations } from '../hooks/useTranslations';

// フォーム選択肢の型定義
const FormOptionsT = t.type({
  affiliations: t.array(t.string),
  posts: t.array(t.string),
  skills: t.array(t.string),
});

type FormOptions = t.TypeOf<typeof FormOptionsT>;

// フォーム選択肢データ取得用のfetcher
const formOptionsFetcher = async (url: string): Promise<FormOptions> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch form options at ${url}`);
  }
  const body = await response.json();
  const decoded = FormOptionsT.decode(body);
  if (isLeft(decoded)) {
    throw new Error(`Failed to decode form options ${JSON.stringify(body)}`);
  }
  return decoded.right;
};

export type AddEmployeeFormProps = {
  onEmployeeAdded?: (employee: Employee) => void;
};

export function AddEmployeeForm({ onEmployeeAdded }: AddEmployeeFormProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [post, setPost] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const t = useTranslations('addEmployee');
  const tCommon = useTranslations('common');
  const tEmployee = useTranslations('employee');

  // フォーム選択肢データを取得（積極的キャッシュ設定）
  const { data: formOptions, error: fetchError } = useSWR<FormOptions, Error>(
    "/api/form-options",
    formOptionsFetcher,
    {
      // 選択肢データは静的なので積極的にキャッシュ
      revalidateOnFocus: false,        // フォーカス時の再検証を無効
      revalidateOnReconnect: false,    // ネットワーク再接続時の再検証を無効
      revalidateIfStale: false,        // staleでも再検証しない
      dedupingInterval: 24 * 60 * 60 * 1000, // 24時間は重複リクエストを無効化
      focusThrottleInterval: 60 * 60 * 1000,  // フォーカス時の再検証を1時間に制限
    }
  );

  // 選択肢を取得
  const affiliationOptions = formOptions?.affiliations || [];
  const postOptions = formOptions?.posts || [];
  const skillOptions = formOptions?.skills || [];

  useEffect(() => {
    if (fetchError) {
      console.error("Failed to fetch form options:", fetchError);
    }
  }, [fetchError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError(t('errors.nameRequired'));
      return;
    }
    
    const ageNumber = parseInt(age, 10);
    if (isNaN(ageNumber) || ageNumber < 1 || ageNumber > 100) {
      setError(t('errors.ageInvalid'));
      return;
    }

    if (!affiliation.trim()) {
      setError(t('errors.affiliationRequired'));
      return;
    }

    if (!post.trim()) {
      setError(t('errors.postRequired'));
      return;
    }

    if (skills.length === 0) {
      setError(t('errors.skillsRequired'));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          age: ageNumber,
          affiliation: affiliation.trim(),
          post: post.trim(),
          skills: skills,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t('errors.addFailed'));
      }

      const newEmployee: Employee = await response.json();
      
      // Reset form and close it
      setName("");
      setAge("");
      setAffiliation("");
      setPost("");
      setSkills([]);
      setError(null);
      setIsFormOpen(false);
      
      // Notify parent component
      if (onEmployeeAdded) {
        onEmployeeAdded(newEmployee);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : tCommon('error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setName("");
    setAge("");
    setAffiliation("");
    setPost("");
    setSkills([]);
    setError(null);
    setIsFormOpen(false);
  };

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
    if (!isFormOpen) {
      // フォームを開く時はエラーをクリア
      setError(null);
    }
  };

  return (
    <Paper
      elevation={1}
      sx={{
        mb: 3,
        overflow: "hidden",
      }}
    >
      {/* フォーム開閉ボタン */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          backgroundColor: isFormOpen ? 'action.selected' : 'action.hover',  // Material-UI標準色
          cursor: "pointer",
          transition: "background-color 0.2s",
          "&:hover": {
            backgroundColor: isFormOpen ? 'action.focus' : 'action.selected',  // Material-UI標準色
          },
        }}
        onClick={toggleForm}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <PersonAddIcon color="primary" />
          <Typography variant="h6" component="h2" fontWeight="bold">
            {t('title')}
          </Typography>
        </Box>
        
        <IconButton
          size="small"
          sx={{ 
            transition: "transform 0.2s",
            transform: isFormOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <ExpandMoreIcon />
        </IconButton>
      </Box>

      {/* 折りたたみ式フォーム */}
      <Collapse in={isFormOpen}>
        <Box sx={{ p: 3, pt: 2, backgroundColor: 'background.paper' }}>
          <Divider sx={{ mb: 3 }} />
          
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label={tEmployee('name')}
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('namePlaceholder')}
              disabled={isSubmitting}
              required
            />
            
            <TextField
              label={tEmployee('age')}
              variant="outlined"
              type="number"
              fullWidth
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder={t('agePlaceholder')}
              disabled={isSubmitting}
              required
            />

            <Autocomplete
              options={affiliationOptions}
              value={affiliation || null}
              onChange={(event, newValue) => {
                setAffiliation(newValue || "");
              }}
              slotProps={{
                popper: {
                  placement: "bottom-start",
                  modifiers: [
                    {
                      name: 'flip',
                      enabled: false,
                    },
                    {
                      name: 'preventOverflow',
                      options: {
                        altBoundary: false,
                        tether: false,
                      },
                    },
                  ],
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={tEmployee('affiliation')}
                  placeholder={t('affiliationPlaceholder')}
                  disabled={isSubmitting}
                />
              )}
              disabled={isSubmitting}
            />

            <Autocomplete
              options={postOptions}
              value={post || null}
              onChange={(event, newValue) => {
                setPost(newValue || "");
              }}
              slotProps={{
                popper: {
                  placement: "bottom-start",
                  modifiers: [
                    {
                      name: 'flip',
                      enabled: false,
                    },
                    {
                      name: 'preventOverflow',
                      options: {
                        altBoundary: false,
                        tether: false,
                      },
                    },
                  ],
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={tEmployee('post')}
                  placeholder={t('postPlaceholder')}
                  disabled={isSubmitting}
                />
              )}
              disabled={isSubmitting}
            />

            <Autocomplete
              multiple
              options={skillOptions}
              value={skills}
              onChange={(event, newValue) => {
                setSkills(newValue);
              }}
              slotProps={{
                popper: {
                  placement: "bottom-start",
                  modifiers: [
                    {
                      name: 'flip',
                      enabled: false,
                    },
                    {
                      name: 'preventOverflow',
                      options: {
                        altBoundary: false,
                        tether: false,
                      },
                    },
                  ],
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={tEmployee('skills')}
                  placeholder={t('skillsPlaceholder')}
                  disabled={isSubmitting}
                />
              )}
              disabled={isSubmitting}
            />
            
            {error && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {error}
              </Alert>
            )}
            
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<AddIcon />}
                disabled={isSubmitting}
                sx={{
                  flex: 1,
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: "bold",
                  textTransform: "none",
                }}
              >
                {isSubmitting ? t('adding') : t('addEmployee')}
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<CloseIcon />}
                onClick={handleCancel}
                disabled={isSubmitting}
                sx={{
                  py: 1.5,
                  fontSize: "1rem",
                  textTransform: "none",
                }}
              >
                {tCommon('cancel')}
              </Button>
            </Box>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
} 