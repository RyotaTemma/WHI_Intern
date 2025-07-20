"use client";

import Select, { SelectChangeEvent } from "@mui/material/Select";
import Box from "@mui/material/Box";
import { MenuItem } from "@mui/material";

// propsの型を定義
interface AttributeFilterProps {
  affiliation: string;
  post: string;
  skill: string;
  onAffiliationChange: (event: SelectChangeEvent<string>) => void;
  onPostChange: (event: SelectChangeEvent<string>) => void;
  onSkillChange: (event: SelectChangeEvent<string>) => void;
}

export function AttributeFilter ({
  affiliation,
  post,
  skill,
  onAffiliationChange,
  onPostChange,
  onSkillChange,
}: AttributeFilterProps) {

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Select value={affiliation} onChange={onAffiliationChange} displayEmpty fullWidth>
        <MenuItem value="">所属を選択</MenuItem>
        <MenuItem value="Engineering">Engineering</MenuItem>
        <MenuItem value="Marketing">Marketing</MenuItem>
        <MenuItem value="Sales">Sales</MenuItem>
        <MenuItem value="Design">Design</MenuItem>
        <MenuItem value="HR">HR</MenuItem>
        <MenuItem value="Finance">Finance</MenuItem>
      </Select>

      <Select value={post} onChange={onPostChange} displayEmpty fullWidth>
        <MenuItem value="">役職を選択</MenuItem>
        <MenuItem value="Software Engineer">Software Engineer</MenuItem>
        <MenuItem value="Senior Software Engineer">Senior Software Engineer</MenuItem>
        <MenuItem value="Tech Lead">Tech Lead</MenuItem>
        <MenuItem value="Marketing Manager">Marketing Manager</MenuItem>
        <MenuItem value="Sales Manager">Sales Manager</MenuItem>
        <MenuItem value="UI/UX Designer">UI/UX Designer</MenuItem>
        <MenuItem value="DevOps Engineer">DevOps Engineer</MenuItem>
        <MenuItem value="HR Specialist">HR Specialist</MenuItem>
        <MenuItem value="Financial Analyst">Financial Analyst</MenuItem>
        <MenuItem value="Graphic Designer">Graphic Designer</MenuItem>
      </Select>

      <Select value={skill} onChange={onSkillChange} displayEmpty fullWidth>
        <MenuItem value="">スキルを選択</MenuItem>
        <MenuItem value="JavaScript">JavaScript</MenuItem>
        <MenuItem value="TypeScript">TypeScript</MenuItem>
        <MenuItem value="React">React</MenuItem>
        <MenuItem value="Node.js">Node.js</MenuItem>
        <MenuItem value="Digital Marketing">Digital Marketing</MenuItem>
        <MenuItem value="Analytics">Analytics</MenuItem>
        <MenuItem value="SEO">SEO</MenuItem>
        <MenuItem value="Sales Strategy">Sales Strategy</MenuItem>
        <MenuItem value="CRM">CRM</MenuItem>
        <MenuItem value="Negotiation">Negotiation</MenuItem>
        <MenuItem value="Figma">Figma</MenuItem>
        <MenuItem value="Photoshop">Photoshop</MenuItem>
        <MenuItem value="User Research">User Research</MenuItem>
        <MenuItem value="AWS">AWS</MenuItem>
        <MenuItem value="Docker">Docker</MenuItem>
        <MenuItem value="Kubernetes">Kubernetes</MenuItem>
        <MenuItem value="Recruitment">Recruitment</MenuItem>
        <MenuItem value="Employee Relations">Employee Relations</MenuItem>
        <MenuItem value="Training">Training</MenuItem>
        <MenuItem value="Financial Analysis">Financial Analysis</MenuItem>
        <MenuItem value="Excel">Excel</MenuItem>
        <MenuItem value="Reporting">Reporting</MenuItem>
        <MenuItem value="Illustrator">Illustrator</MenuItem>
        <MenuItem value="Branding">Branding</MenuItem>
        <MenuItem value="Print Design">Print Design</MenuItem>
      </Select>
    </Box>
  );
}