import { useState } from "react";
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Palette,
  Globe,
  Save,
} from "lucide-react";
import { useTheme } from "../../contexts/useTheme.js";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      weeklyReports: true,
      newUserAlerts: true,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: "30",
      passwordExpiry: "90",
    },
    appearance: {
      language: "en",
    },
    general: {
      siteName: "Service Marketplace",
      maintenanceMode: false,
      allowRegistrations: true,
    },
  });

  const handleSettingChange = (category, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  // TODO: Replace with API call: PUT /api/settings
  const handleSave = () => {
    console.log("Saving settings:", settings);
    // TODO: Call API: PUT /api/settings with settings data
    alert(
      "Settings saved successfully! (Replace with API call to PUT /api/settings)"
    );
  };

  return (
    <main className="flex-1 p-6 text-primary">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1 text-primary">Settings</h1>
          <p className="text-sm text-muted">
            Manage your application settings and preferences.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 transition px-4 py-2 rounded-xl shadow-[var(--shadow-soft)]"
        >
          <Save size={16} />
          <span className="text-sm font-medium">Save Changes</span>
        </button>
      </header>

      <div className="space-y-6">
        {/* Notifications Section */}
        <section className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell size={20} className="text-blue-400" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted">
                  Receive email alerts for important events
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.emailNotifications}
                  onChange={(e) =>
                    handleSettingChange(
                      "notifications",
                      "emailNotifications",
                      e.target.checked
                    )
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted">
                  Receive browser push notifications
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.pushNotifications}
                  onChange={(e) =>
                    handleSettingChange(
                      "notifications",
                      "pushNotifications",
                      e.target.checked
                    )
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Weekly Reports</p>
                <p className="text-sm text-muted">
                  Receive weekly summary reports via email
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.weeklyReports}
                  onChange={(e) =>
                    handleSettingChange(
                      "notifications",
                      "weeklyReports",
                      e.target.checked
                    )
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New User Alerts</p>
                <p className="text-sm text-muted">
                  Get notified when new users register
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.newUserAlerts}
                  onChange={(e) =>
                    handleSettingChange(
                      "notifications",
                      "newUserAlerts",
                      e.target.checked
                    )
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield size={20} className="text-blue-400" />
            <h2 className="text-lg font-semibold">Security</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted">
                  Add an extra layer of security to your account
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.security.twoFactorAuth}
                  onChange={(e) =>
                    handleSettingChange(
                      "security",
                      "twoFactorAuth",
                      e.target.checked
                    )
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Session Timeout (minutes)</p>
                <p className="text-sm text-muted">
                  Automatically log out after inactivity
                </p>
              </div>
              <select
                value={settings.security.sessionTimeout}
                onChange={(e) =>
                  handleSettingChange(
                    "security",
                    "sessionTimeout",
                    e.target.value
                  )
                }
                className="bg-card/80 border border-white/5 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">60 minutes</option>
                <option value="120">2 hours</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Password Expiry (days)</p>
                <p className="text-sm text-muted">
                  Require password change after specified days
                </p>
              </div>
              <select
                value={settings.security.passwordExpiry}
                onChange={(e) =>
                  handleSettingChange(
                    "security",
                    "passwordExpiry",
                    e.target.value
                  )
                }
                className="bg-card/80 border border-white/5 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
                <option value="180">180 days</option>
                <option value="365">1 year</option>
              </select>
            </div>
          </div>
        </section>

        {/* Appearance Section */}
        <section className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Palette size={20} className="text-blue-400" />
            <h2 className="text-lg font-semibold">Appearance</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-muted">
                  Choose your preferred color theme
                </p>
              </div>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="bg-card/80 border border-white/5 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Language</p>
                <p className="text-sm text-muted">
                  Select your preferred language
                </p>
              </div>
              <select
                value={settings.appearance.language}
                onChange={(e) =>
                  handleSettingChange("appearance", "language", e.target.value)
                }
                className="bg-card/80 border border-white/5 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>
        </section>

        {/* General Settings Section */}
        <section className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe size={20} className="text-blue-400" />
            <h2 className="text-lg font-semibold">General</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Site Name
              </label>
              <input
                type="text"
                value={settings.general.siteName}
                onChange={(e) =>
                  handleSettingChange("general", "siteName", e.target.value)
                }
                className="w-full bg-card/80 border border-white/5 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Maintenance Mode</p>
                <p className="text-sm text-muted">
                  Temporarily disable public access to the site
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.general.maintenanceMode}
                  onChange={(e) =>
                    handleSettingChange(
                      "general",
                      "maintenanceMode",
                      e.target.checked
                    )
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Allow New Registrations</p>
                <p className="text-sm text-muted">
                  Enable or disable new user registrations
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.general.allowRegistrations}
                  onChange={(e) =>
                    handleSettingChange(
                      "general",
                      "allowRegistrations",
                      e.target.checked
                    )
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
