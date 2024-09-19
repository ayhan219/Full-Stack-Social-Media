import React, { useState } from 'react';

const Settings = () => {
  const [volume, setVolume] = useState(50);
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(true);

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const toggleNotifications = () => {
    setNotifications(!notifications);
  };

  return (
    <div className=" w-full bg-black h-screen p-6 space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      {/* Volume Control */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Volume Control</h3>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <p className="text-sm">Current Volume: {volume}%</p>
      </div>

      {/* Language Settings */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Language</h3>
        <select
          value={language}
          onChange={handleLanguageChange}
          className="p-2 border border-gray-300 rounded-lg"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="zh">Chinese</option>
        </select>
        <p className="text-sm">Current Language: {language.toUpperCase()}</p>
      </div>

      {/* Theme Settings */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Theme</h3>
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-lg text-white ${
            theme === 'light' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'
          }`}
        >
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
        </button>
        <p className="text-sm">Current Theme: {theme === 'light' ? 'Light Mode' : 'Dark Mode'}</p>
      </div>

      {/* Notification Settings */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Notifications</h3>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={notifications}
            onChange={toggleNotifications}
            className="mr-2"
          />
          <label>Enable Notifications</label>
        </div>
        <p className="text-sm">
          Notifications are {notifications ? 'enabled' : 'disabled'}.
        </p>
      </div>
    </div>
  );
};

export default Settings;
