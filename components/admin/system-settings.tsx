"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Save, RefreshCw, AlertTriangle } from "lucide-react"

export function SystemSettings() {
  const [settings, setSettings] = useState({
    // ML Settings
    mlEnabled: true,
    confidenceThreshold: 0.8,
    autoVerification: false,
    batchProcessing: true,

    // Notification Settings
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    emergencyBroadcast: true,

    // Social Media Settings
    twitterMonitoring: true,
    facebookMonitoring: true,
    instagramMonitoring: false,
    redditMonitoring: true,
    monitoringInterval: 5,

    // System Settings
    maxReportsPerUser: 10,
    reportRetentionDays: 365,
    autoBackup: true,
    backupInterval: 24,
    maintenanceMode: false,

    // API Settings
    rateLimitEnabled: true,
    maxRequestsPerMinute: 100,
    apiTimeout: 30,
  })

  const handleSave = () => {
    // Save settings logic here
    console.log("[v0] Saving system settings:", settings)
  }

  const handleReset = () => {
    // Reset to defaults logic here
    console.log("[v0] Resetting system settings to defaults")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Configuration</CardTitle>
          <CardDescription>Configure Atlas-Alert system settings and parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* ML Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Machine Learning Configuration</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="ml-enabled">Enable ML Processing</Label>
                <Switch
                  id="ml-enabled"
                  checked={settings.mlEnabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, mlEnabled: checked })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confidence-threshold">Confidence Threshold</Label>
                <Input
                  id="confidence-threshold"
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.confidenceThreshold}
                  onChange={(e) => setSettings({ ...settings, confidenceThreshold: Number.parseFloat(e.target.value) })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-verification">Auto Verification</Label>
                <Switch
                  id="auto-verification"
                  checked={settings.autoVerification}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoVerification: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="batch-processing">Batch Processing</Label>
                <Switch
                  id="batch-processing"
                  checked={settings.batchProcessing}
                  onCheckedChange={(checked) => setSettings({ ...settings, batchProcessing: checked })}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Notification Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Notification Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <Switch
                  id="email-notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sms-notifications">SMS Notifications</Label>
                <Switch
                  id="sms-notifications"
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <Switch
                  id="push-notifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="emergency-broadcast">Emergency Broadcast</Label>
                <Switch
                  id="emergency-broadcast"
                  checked={settings.emergencyBroadcast}
                  onCheckedChange={(checked) => setSettings({ ...settings, emergencyBroadcast: checked })}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Social Media Monitoring */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Social Media Monitoring</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="twitter-monitoring">Twitter Monitoring</Label>
                <Switch
                  id="twitter-monitoring"
                  checked={settings.twitterMonitoring}
                  onCheckedChange={(checked) => setSettings({ ...settings, twitterMonitoring: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="facebook-monitoring">Facebook Monitoring</Label>
                <Switch
                  id="facebook-monitoring"
                  checked={settings.facebookMonitoring}
                  onCheckedChange={(checked) => setSettings({ ...settings, facebookMonitoring: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="instagram-monitoring">Instagram Monitoring</Label>
                <Switch
                  id="instagram-monitoring"
                  checked={settings.instagramMonitoring}
                  onCheckedChange={(checked) => setSettings({ ...settings, instagramMonitoring: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="reddit-monitoring">Reddit Monitoring</Label>
                <Switch
                  id="reddit-monitoring"
                  checked={settings.redditMonitoring}
                  onCheckedChange={(checked) => setSettings({ ...settings, redditMonitoring: checked })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monitoring-interval">Monitoring Interval (minutes)</Label>
                <Input
                  id="monitoring-interval"
                  type="number"
                  min="1"
                  max="60"
                  value={settings.monitoringInterval}
                  onChange={(e) => setSettings({ ...settings, monitoringInterval: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* System Limits */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">System Limits & Maintenance</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="max-reports">Max Reports per User (daily)</Label>
                <Input
                  id="max-reports"
                  type="number"
                  min="1"
                  max="100"
                  value={settings.maxReportsPerUser}
                  onChange={(e) => setSettings({ ...settings, maxReportsPerUser: Number.parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="retention-days">Report Retention (days)</Label>
                <Input
                  id="retention-days"
                  type="number"
                  min="30"
                  max="3650"
                  value={settings.reportRetentionDays}
                  onChange={(e) => setSettings({ ...settings, reportRetentionDays: Number.parseInt(e.target.value) })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-backup">Auto Backup</Label>
                <Switch
                  id="auto-backup"
                  checked={settings.autoBackup}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoBackup: checked })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="backup-interval">Backup Interval (hours)</Label>
                <Input
                  id="backup-interval"
                  type="number"
                  min="1"
                  max="168"
                  value={settings.backupInterval}
                  onChange={(e) => setSettings({ ...settings, backupInterval: Number.parseInt(e.target.value) })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                  <p className="text-xs text-slate-500">Disables public access</p>
                </div>
                <Switch
                  id="maintenance-mode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* API Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">API Configuration</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="rate-limit">Rate Limiting</Label>
                <Switch
                  id="rate-limit"
                  checked={settings.rateLimitEnabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, rateLimitEnabled: checked })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-requests">Max Requests per Minute</Label>
                <Input
                  id="max-requests"
                  type="number"
                  min="10"
                  max="1000"
                  value={settings.maxRequestsPerMinute}
                  onChange={(e) => setSettings({ ...settings, maxRequestsPerMinute: Number.parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-timeout">API Timeout (seconds)</Label>
                <Input
                  id="api-timeout"
                  type="number"
                  min="5"
                  max="300"
                  value={settings.apiTimeout}
                  onChange={(e) => setSettings({ ...settings, apiTimeout: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button variant="outline" onClick={handleReset} className="flex items-center gap-2 bg-transparent">
              <RefreshCw className="h-4 w-4" />
              Reset to Defaults
            </Button>
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {settings.maintenanceMode && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-amber-800">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">Maintenance Mode Active</span>
            </div>
            <p className="text-sm text-amber-700 mt-1">
              The system is currently in maintenance mode. Public access is disabled and only administrators can access
              the platform.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
