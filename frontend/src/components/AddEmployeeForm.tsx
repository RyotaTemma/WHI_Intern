"use client";
import { useState } from "react";
import { 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Alert,
  Divider,
  Collapse,
  IconButton
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CloseIcon from "@mui/icons-material/Close";
import { Employee } from "../models/Employee";

export type AddEmployeeFormProps = {
  onEmployeeAdded?: (employee: Employee) => void;
};

export function AddEmployeeForm({ onEmployeeAdded }: AddEmployeeFormProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("名前を入力してください");
      return;
    }
    
    const ageNumber = parseInt(age, 10);
    if (isNaN(ageNumber) || ageNumber <= 0) {
      setError("有効な年齢を入力してください");
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
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "従業員の追加に失敗しました");
      }

      const newEmployee: Employee = await response.json();
      
      // Reset form and close it
      setName("");
      setAge("");
      setError(null);
      setIsFormOpen(false);
      
      // Notify parent component
      if (onEmployeeAdded) {
        onEmployeeAdded(newEmployee);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setName("");
    setAge("");
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
          backgroundColor: isFormOpen ? "#e3f2fd" : "#fafafa",
          cursor: "pointer",
          transition: "background-color 0.2s",
          "&:hover": {
            backgroundColor: isFormOpen ? "#bbdefb" : "#f0f0f0",
          },
        }}
        onClick={toggleForm}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <PersonAddIcon color="primary" />
          <Typography variant="h6" component="h2" fontWeight="bold">
            従業員を追加
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
        <Box sx={{ p: 3, pt: 2, backgroundColor: "white" }}>
          <Divider sx={{ mb: 3 }} />
          
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="名前"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="従業員の名前を入力"
              disabled={isSubmitting}
              required
            />
            
            <TextField
              label="年齢"
              variant="outlined"
              type="number"
              fullWidth
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="年齢を入力"
              inputProps={{ min: 1, max: 100 }}
              disabled={isSubmitting}
              required
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
                {isSubmitting ? "追加中..." : "従業員を追加"}
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
                キャンセル
              </Button>
            </Box>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
} 