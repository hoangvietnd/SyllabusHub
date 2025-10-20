import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', name: 'English', flag: '/flags/gb.svg' },
  { code: 'vi', name: 'Tiếng Việt', flag: '/flags/vn.svg' }
];

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    handleClose();
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <div>
      <IconButton
        aria-label="change language"
        aria-controls="language-menu"
        aria-haspopup="true"
        onClick={handleClick}
        color="inherit"
      >
          <Avatar sx={{ width: 24, height: 24 }} src={currentLanguage.flag} alt={currentLanguage.name} />
      </IconButton>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-button',
        }}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            selected={language.code === i18n.language}
            onClick={() => changeLanguage(language.code)}
          >
            <ListItemIcon>
                <Avatar sx={{ width: 24, height: 24 }} src={language.flag} alt={language.name} />
            </ListItemIcon>
            <ListItemText primary={language.name} />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default LanguageSwitcher;
