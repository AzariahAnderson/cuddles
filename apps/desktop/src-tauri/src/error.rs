//! Unified error model. Serialised to the renderer as `{ "kind": "...", ... }` and mirrored
//! by a discriminated union in TypeScript. Errors are never plain strings.

use serde::Serialize;
use thiserror::Error;

#[derive(Debug, Error, Serialize)]
#[serde(tag = "kind")]
pub enum AppError {
    #[error("validation failed: {message}")]
    ValidationError { message: String },
    #[error("permission denied: {message}")]
    PermissionError { message: String },
    #[error("provider error: {message}")]
    ProviderError { message: String },
    #[error("network error: {message}")]
    NetworkError { message: String },
    #[error("workspace error: {message}")]
    WorkspaceError { message: String },
    #[error("filesystem error: {message}")]
    FilesystemError { message: String },
    #[error("process error: {message}")]
    ProcessError { message: String },
    #[error("terminal error: {message}")]
    TerminalError { message: String },
    #[error("agent error: {message}")]
    AgentError { message: String },
    #[error("internal error: {message}")]
    InternalError { message: String },
    /// A declared capability that has not been built yet. Never fabricates data.
    #[error("not implemented: {capability}")]
    NotImplemented { capability: String },
}
