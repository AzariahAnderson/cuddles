use serde::Serialize;
use tauri::AppHandle;

use crate::error::AppError;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AppInfo {
    pub name: String,
    pub version: String,
    pub os: &'static str,
    pub arch: &'static str,
}

/// Non-sensitive runtime facts. Proves the typed IPC round trip end to end.
#[tauri::command]
pub fn app_info(app: AppHandle) -> Result<AppInfo, AppError> {
    let package = app.package_info();
    Ok(AppInfo {
        name: package.name.clone(),
        version: package.version.to_string(),
        os: std::env::consts::OS,
        arch: std::env::consts::ARCH,
    })
}
