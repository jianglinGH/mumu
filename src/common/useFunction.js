import { useEffect, useState, useCallback } from "react";

const useSyncCallback = callback => {
    const [proxyState, setProxyState] = useState({current: false});

    useEffect(() => {
        if(proxyState.current) {
            setProxyState({current: false});
        }
    })

    useEffect(() => {
        proxyState.current && callback();
    })

    const doCallback = useCallback(() => {
        setProxyState({current: true});
    }, [proxyState])

    return doCallback;
}

export {useSyncCallback};