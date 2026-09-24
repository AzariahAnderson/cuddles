//! Logging. Verbose in debug builds, quiet in release; override with the CUDDLES_LOG env var.
//! Rule: never log API keys, tokens, passwords, secret values or sensitive file contents.

use tracing_subscriber::EnvFilter;

pub fn init() {
    let default_level = if cfg!(debug_assertions) {
        "debug"
    } else {
        "warn"
    };
    let filter =
        EnvFilter::try_from_env("CUDDLES_LOG").unwrap_or_else(|_| EnvFilter::new(default_level));
    let _ = tracing_subscriber::fmt()
        .with_env_filter(filter)
        .with_target(true)
        .try_init();
}
