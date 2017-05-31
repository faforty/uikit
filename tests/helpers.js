
const USER_AGENTS = {
    default: window.navigator.userAgent,
    iphone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25',
    ipad:   'Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25',
}

beforeEach(() => {
    setUserAgent('default');
});

export function setUserAgent(userAgent) {
    navigator.__defineGetter__('userAgent', () => USER_AGENTS[userAgent] || userAgent);
}