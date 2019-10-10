export const conf = {
    API_BASE_URL: process.env.REACT_APP_API_URL,
    GET_USER_SKILL_URL: '/GetUserSkillFunction',
    GET_USER_SKILL_API_KEY: process.env.REACT_APP_GET_USER_SKILL_API_KEY,
    POST_EVALUATION_URL: '/AddEvaluationFunction',
    POST_EVALUATION_API_KEY: process.env.REACT_APP_POST_EVALUATION_API_KEY,
    AUTHORITY: process.env.REACT_APP_SKILLS_AUTHORITY,
    CLIENT_ID: process.env.REACT_APP_SKILLS_CLIENT_ID,
    TENANT_ID: process.env.REACT_APP_SKILLS_TENANT_ID,
};

export const msalConfig = {
    auth: {
        clientId: conf.CLIENT_ID,
        authority: conf.AUTHORITY + conf.TENANT_ID,
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true
    }
};

