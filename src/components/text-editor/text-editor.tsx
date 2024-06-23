/* eslint-disable @typescript-eslint/no-explicit-any */
import Quill from "quill";
import { useCallback, useEffect, useState } from "react";
import 'quill/dist/quill.snow.css';
import './text-editor.css';
import { Socket, io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { QUILL_EVENTS, SAVE_INTERVAL_MS, SOCKET_EVENTS, TOOLBAR_OPTIONS } from "../../constants/constants";


const TextEditor: React.FC = () => {
    const [socket, setSocket] = useState<Socket>();
    const [quill, setQuill] = useState<Quill>();
    const {id: documentId} = useParams();
    useEffect(() => {
        const s = io('https://google-docs-backend-onpi.onrender.com', {
            transports: ['websocket'] 
        });

        s.on(SOCKET_EVENTS.CONNECTION_ERROR, (err) => {
            console.error('Connection Error:', err);
        });

        setSocket(s);
        return () => {
            s.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!socket || !quill) return;

        const handleTextChange = (delta: any,oldDelta: any,source: any) => {
            if (source !== 'user') return;
            console.log(oldDelta);
            socket.emit(SOCKET_EVENTS.SEND_CHANGES, delta);
        };

        quill.on(QUILL_EVENTS.TEXT_CHANGE, handleTextChange);

        const handleReceiveChanges = (delta: any) => {
            quill.updateContents(delta);
        };

        socket.on(SOCKET_EVENTS.RECEIVE_CHANGES, handleReceiveChanges);

        return () => {
            quill.off(QUILL_EVENTS.TEXT_CHANGE, handleTextChange);
            socket.off(SOCKET_EVENTS.RECEIVE_CHANGES, handleReceiveChanges);
        };
    }, [socket, quill]);

    useEffect(() => {
        
        if(!socket || !quill) return;
        socket.once(SOCKET_EVENTS.LOAD_DOCUMENT,document =>{
            quill.setContents(document);
            quill.enable();
        })
        socket.emit(SOCKET_EVENTS.GET_DOCUMENT,documentId);

    },[socket,quill,documentId])

    useEffect(() => {
        if(!socket || !quill) return;

        const interval = setInterval(() => {
            socket.emit(SOCKET_EVENTS.GET_DOCUMENT,quill.getContents());
        },SAVE_INTERVAL_MS)

        return () => {
            clearInterval(interval);
        }
    },[socket,quill])

    const wrapperRef = useCallback((wrapper: any) => {
        if (wrapper === null) return;
        wrapper.innerHTML = "";
        const editor = document.createElement('div');
        wrapper.append(editor);
        const q = new Quill(editor, { theme: 'snow', modules: { toolbar: TOOLBAR_OPTIONS } });
        q.disable();
        q.setText('Loading...');
        setQuill(q);
    }, []);

    return <div className="container" ref={wrapperRef}></div>;
};

export default TextEditor;
