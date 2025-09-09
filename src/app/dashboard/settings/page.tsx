
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/context/currency-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserData } from "@/context/user-data-context";
import { Currency, UserSettings } from "@/lib/firestore";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const { toast } = useToast();
  const { settings, updateSettings, loading } = useUserData();
  const [localSettings, setLocalSettings] = useState<UserSettings | null>(null);

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleSettingsChange = (key: string, value: any) => {
    if (localSettings) {
      const keys = key.split('.');
      if (keys.length === 1) {
        setLocalSettings({ ...localSettings, [key]: value });
      } else {
        const newSettings = { ...localSettings };
        let current: any = newSettings;
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        setLocalSettings(newSettings);
      }
    }
  };

  const handleSave = async () => {
    if (localSettings) {
        await updateSettings(localSettings);
        toast({
          title: "Settings Saved",
          description: "Your changes have been successfully saved.",
        });
    }
  };

  if (loading.settings || !localSettings) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
            <CardDescription>Manage your app settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={localSettings.currency}
                onValueChange={(value: Currency) => handleSettingsChange('currency', value)}
              >
                <SelectTrigger id="currency" className="w-[180px]">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">INR (₹)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label htmlFor="monthly-income">Monthly Income</Label>
              <Input
                id="monthly-income"
                type="number"
                value={localSettings.income}
                onChange={(e) => handleSettingsChange('income', parseInt(e.target.value, 10) || 0)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget Settings</CardTitle>
            <CardDescription>
              Define your monthly budget and category limits.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="monthly-budget">Overall Monthly Budget</Label>
              <Input
                id="monthly-budget"
                type="number"
                value={localSettings.monthlyBudget}
                onChange={(e) => handleSettingsChange('monthlyBudget', parseInt(e.target.value, 10) || 0)}
              />
            </div>
            <p className="text-sm text-muted-foreground pt-4">
              Category limits coming soon.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Configure alerts for your account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label htmlFor="overspending-alerts">Overspending Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Receive a notification when you're about to exceed a budget category.
                </p>
              </div>
              <Switch
                id="overspending-alerts"
                checked={localSettings.notifications.overspending}
                onCheckedChange={(value) => handleSettingsChange('notifications.overspending', value)}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label htmlFor="bill-reminders">Upcoming Bill Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Get reminded a few days before a bill is due.
                </p>
              </div>
              <Switch
                id="bill-reminders"
                checked={localSettings.notifications.billReminders}
                onCheckedChange={(value) => handleSettingsChange('notifications.billReminders', value)}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label htmlFor="income-deposits">Income Deposits</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when you receive income.
                </p>
              </div>
              <Switch
                id="income-deposits"
                checked={localSettings.notifications.incomeDeposits}
                onCheckedChange={(value) => handleSettingsChange('notifications.incomeDeposits', value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>
              Manage your account security settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account.
                </p>
              </div>
              <Button variant="outline" disabled>Enable</Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
