//! Cuddles native runtime.
//!
//! Rust owns every privileged operation. The renderer reaches it only through narrow, named,
//! typed commands (see `commands`), each explicitly granted in `capabilities/`.

pub mod agent;
pub mod commands;
pub mod error;
pub mod logging;
pub mod platform;
pub mod process;
pub mod security;
pub mod storage;
pub mod terminal;
pub mod workspace;

/// Builds and runs the Tauri application.
pub fn run() {
    logging::init();
    tracing::info!("starting Cuddles");

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![commands::app::app_info])
        .run(tauri::generate_context!())
        .expect("error while running Cuddles");
}
