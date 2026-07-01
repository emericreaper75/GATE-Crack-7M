import React from "react";
import { useStore } from "../store";
import { Card, CardContent, CardHeader, CardTitle, Button } from "../components/ui";
import { Download, Upload, Trash2, HardDrive, ShieldAlert } from "lucide-react";
import { del } from 'idb-keyval';
import CryptoJS from 'crypto-js';

const DISASTER_RECOVERY_KEY = "GATE_OS_CORE_KEY_2027";

export function Settings() {
  const store = useStore();

  const handleExport = () => {
    // Only extract the data keys from the store state (ignoring actions)
    const { 
      tasks, pyqLogs, mocks, formulas, errors, 
      weeklyReviews, mastery, priorityBoard, reminders, 
      milestones, notes, settings 
    } = store;
    
    const dataToExport = {
      tasks, pyqLogs, mocks, formulas, errors, 
      weeklyReviews, mastery, priorityBoard, reminders, 
      milestones, notes, settings 
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "gate-dashboard-export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleSafeShutdown = () => {
    const { 
      tasks, pyqLogs, mocks, formulas, errors, 
      weeklyReviews, mastery, priorityBoard, reminders, 
      milestones, notes, settings 
    } = store;
    
    const dataToExport = {
      tasks, pyqLogs, mocks, formulas, errors, 
      weeklyReviews, mastery, priorityBoard, reminders, 
      milestones, notes, settings 
    };

    const jsonStr = JSON.stringify(dataToExport);
    const encryptedData = CryptoJS.AES.encrypt(jsonStr, DISASTER_RECOVERY_KEY).toString();
    
    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(encryptedData);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `gate-recovery-${new Date().toISOString().split('T')[0]}.enc`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        let content = event.target?.result as string;
        
        if (file.name.endsWith('.enc')) {
          const bytes = CryptoJS.AES.decrypt(content, DISASTER_RECOVERY_KEY);
          content = bytes.toString(CryptoJS.enc.Utf8);
          if (!content) throw new Error("Decryption failed");
        }

        const importedData = JSON.parse(content);
        useStore.setState(importedData);
        alert("Data imported successfully!");
      } catch (error) {
        alert("Error importing data. Invalid or corrupted file.");
      }
    };
    reader.readAsText(file);
  };

  const handleClear = async () => {
    if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
      await del("gate_store");
      window.location.reload();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <Card className="border-accent-primary/20 bg-accent-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-accent-primary">
            <HardDrive className="w-5 h-5" />
            Local Machine Storage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-secondary leading-relaxed">
            <strong>Privacy First:</strong> Your GATE Tracker data is stored strictly on your local machine using an offline-first IndexedDB database. 
            No data is ever sent to a remote server. You can install this application as a PWA and use it completely offline. 
            Because data lives in your browser, remember to export JSON backups periodically.
          </p>
        </CardContent>
      </Card>

      <Card className="border-accent-warning/30 bg-accent-warning/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-accent-warning">
            <ShieldAlert className="w-5 h-5" />
            Disaster Recovery
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-bg-elevated rounded-md border border-accent-warning/20 gap-4">
            <div>
              <h3 className="font-bold text-text-primary">Safe Shutdown</h3>
              <p className="text-sm text-text-secondary mt-1">Triggers an immediate automated download of your current state as an encrypted JSON (.enc) file. Use this protocol before clearing browser data or changing devices.</p>
            </div>
            <Button onClick={handleSafeShutdown} className="w-full sm:w-auto shrink-0 gap-2 bg-accent-warning hover:bg-accent-warning/80 text-bg-primary">
              <ShieldAlert className="w-4 h-4" /> Execute Safe Shutdown
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-bg-elevated rounded-md border border-border gap-4">
            <div>
              <h3 className="font-bold text-text-primary">Export all data</h3>
              <p className="text-sm text-text-secondary">Download a cleartext JSON backup of your progress.</p>
            </div>
            <Button onClick={handleExport} className="w-full sm:w-auto shrink-0 gap-2">
              <Download className="w-4 h-4" /> Export JSON
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-bg-elevated rounded-md border border-border gap-4">
            <div>
              <h3 className="font-bold text-text-primary">Import data</h3>
              <p className="text-sm text-text-secondary">Restore progress from a JSON or encrypted (.enc) backup.</p>
            </div>
            <div className="relative w-full sm:w-auto shrink-0">
              <input 
                type="file" 
                accept=".json,.enc" 
                onChange={handleImport} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              />
              <Button variant="outline" className="w-full gap-2 pointer-events-none">
                <Upload className="w-4 h-4" /> Import Backup
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-accent-danger/20 bg-accent-danger/5 rounded-md mt-8 gap-4">
            <div>
              <h3 className="font-bold text-accent-danger">Danger Zone</h3>
              <p className="text-sm text-text-secondary">Permanently delete all local data.</p>
            </div>
            <Button variant="outline" className="w-full sm:w-auto shrink-0 border-accent-danger text-accent-danger hover:bg-accent-danger/10 gap-2" onClick={handleClear}>
              <Trash2 className="w-4 h-4" /> Clear All Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
