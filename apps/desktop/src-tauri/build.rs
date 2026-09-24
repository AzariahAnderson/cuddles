fn main() {
    // Custom app commands are deny-by-default: each must be listed here AND granted in a
    // capability file (capabilities/default.json) before the renderer may call it.
    tauri_build::try_build(
        tauri_build::Attributes::new()
            .app_manifest(tauri_build::AppManifest::new().commands(&["app_info"])),
    )
    .expect("failed to run tauri-build");
}
