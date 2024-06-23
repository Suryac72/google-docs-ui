export const SOCKET_EVENTS = {
    GET_DOCUMENT:'get-document',
    LOAD_DOCUMENT:'load-document',
    SEND_CHANGES:'send-changes',
    SAVE_DOCUMENT:'save-document',
    RECEIVE_CHANGES:'receive-changes',
    DISCONNECT:'disconnect',
    CONNECTION_ERROR: 'connect_error'
}

export const QUILL_EVENTS = {
    TEXT_CHANGE: 'text-change'
}

export const SAVE_INTERVAL_MS = 2000;
export const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
];
