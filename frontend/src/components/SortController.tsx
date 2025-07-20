"use client";

import React, { useState } from 'react';
import {
  Box, Button, Popper, Paper, Select, MenuItem,
  FormControl, InputLabel, SelectChangeEvent, Typography
} from '@mui/material';
import SortIcon from '@mui/icons-material/Sort'; // 並び替えアイコン

// ソートキーとソート順の型を定義
// 'skill' を 'skills' に変更
export type SortKey = 'age' | 'affiliation' | 'post' | 'skills' | '';
export type SortOrder = 'asc' | 'desc';

// Propsの型を定義
interface SortControllerProps {
  sortKey: SortKey;
  sortOrder: SortOrder;
  onSortKeyChange: (event: SelectChangeEvent<string>) => void;
  onSortOrderChange: (event: SelectChangeEvent<string>) => void;
}

export function SortController({
  sortKey,
  sortOrder,
  onSortKeyChange,
  onSortOrderChange,
}: SortControllerProps) {
  // Popperの表示状態を管理
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  

  // ボタンクリック時の処理
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'sort-popper' : undefined;

  return (
    <>
      <Button
        aria-describedby={id}
        variant="outlined"
        onClick={handleClick}
        startIcon={<SortIcon />}
      >
      </Button>

      {/* ポップアップで表示される設定パネル */}
      <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start">
        <Paper sx={{ p: 2, mt: 1, border: '1px solid #ddd', minWidth: '300px' }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            並び替え条件
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* ソート項目を選択 */}
            <FormControl size="small" fullWidth>
              <InputLabel id="sort-key-label">項目</InputLabel>
              <Select
                labelId="sort-key-label"
                value={sortKey}
                label="項目"
                onChange={onSortKeyChange}
              >
                <MenuItem value=""><em>選択しない</em></MenuItem>
                <MenuItem value="age">年齢</MenuItem>
                <MenuItem value="affiliation">所属</MenuItem>
                <MenuItem value="post">役職</MenuItem>
                <MenuItem value="skills">スキル</MenuItem>
              </Select>
            </FormControl>

            {/* 昇順・降順を選択 */}
            <FormControl size="small" fullWidth>
              <InputLabel id="sort-order-label">順序</InputLabel>
              <Select
                labelId="sort-order-label"
                value={sortOrder}
                label="順序"
                onChange={onSortOrderChange}
                disabled={!sortKey} // 項目が未選択の場合は無効化
              >
                <MenuItem value="asc">昇順</MenuItem>
                <MenuItem value="desc">降順</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>
      </Popper>
    </>
  );
}