import { ObjectId } from "mongodb";
import {getTimeInSeconds} from "./general_service";
//God this is unorganized

export interface RouterCallback {
    (req: any, res: any, resources:Array<string>): void;
}

export interface MethodsInterface {
    GET: RouterCallback; 
    POST: RouterCallback;
    DELETE: RouterCallback;
    PUT: RouterCallback;
}

export interface ResourceInterface {
    GET?: Array<string>;
    POST?: Array<string>;
    DELETE?: Array<string>;
    PUT?: Array<string>;
}

export let isResourceInterface = (obj: any):boolean => { 
    if(obj === undefined) return false;
    return Object.keys(obj as ResourceInterface).some((method:string) => ['GET', 'POST', 'DELETE', 'PUT'].includes(method));
}

//---------------------//
// Database interfaces //
//---------------------//

// Interface of the user object
export interface UserInterface {
    _id: ObjectId;
    
    // These are the two basic fields that
    // Are required for every user object
    username: string;
    email: string;

    picture?: {
        64: string; 
        256: string;
        512: string;
    }

    // These are the optional fields, either
    // Generated by the system or set by the user
    authentication: {
        password?: {
            inuse: boolean;

            history: Array<{
                date: number;
                hash: string;
                ip: string;
            }>;

            // The Hash of the password
            hash: string;
            last_login: number;
        },

        sms?: {
            inuse: boolean;

            history: Array<{
                date: number;
                number: string;
                code: string;
                ip: string;     
            }>;

            // The phone number of the user
            number: string;

            // The country code of the number
            code: string;
            last_login: number;
        }

        discord_oauth?: {
            inuse: boolean; 

            history: Array<{
                date: number;
                id: string; 
                ip: string; 
            }>;

            // The id of the user from the discord api
            id: string; 
            last_login: number;
        }

        last_login: number;
        login_attempts: number;
    }

    // These are values that are only set once upon registration                
    registration: {
        date: number;
        ip: string;
    }

    // This contains the ID's of the roles that the user has
    roles: Array<ObjectId>

    // This contains the ID's of the content that the user ownes
    content: Array<ObjectId>

    // This contains the ID's of the tokens that are linked to the user
    tokens: Array<ObjectId>
}

export interface SingupInterface {
    user_name: string;
    email: string;
    password: string;        
    ip: string;   
}

export interface TokenInterface {
    _id: ObjectId;
    user_id: ObjectId | string;
    token: string;
    timestamp: number;
    expiration: number;
    admin: boolean;

    // Used for the token validation //
    // these are not stored in the DB //
    combined?: string;
    expired?: boolean;
    authorized?: boolean;
}

//------------------//
// other interfaces //
//------------------//

export interface AuthCollection {
    ip: string;
    user: string;
}

//this is wraped in a function so that we can just call it
//and edit the object without having to clone it.
export let UserInterfaceTemplate = (): any => {
    return {
        _id: new ObjectId(),
        user_name: '',
        email: '',
        password: '',
        language: 'EN',
        
        profile_picture: '',

        previous_info: {
            user_name: [],
            email: [],
            password: [],
        },

        permissions: {
            roles: [  ],
            owner: false,
        },

        security_info: {
            last_login: getTimeInSeconds(),
            signup_ip: '',
            account_locked: false,
            account_creation: getTimeInSeconds(),
        },

        content: [],
    };
}

export interface ErrorInterface {
    code: number;
    local_key: string;
    where?: string;
    message: string;
}

const errorKeys = ['code', 'local_key', 'where', 'message'];

export const isErrorInterface = (obj: any):boolean => {
    // If nothing is passed in, return false
    if(obj === undefined) return false;

    // This key is not required, so if it is not there, we can assume it is valid
    if(obj?.where === undefined) obj.where = '';

    // Check if the object has all the keys
    return Object.keys(obj).every((key:string) => errorKeys.includes(key));
}

export interface AddonInterface {
    name: string;
    description: string;
    version: string;
    author: string;
    author_email?: string;

    entry_point: string;

    update?: {
        update_url: string;
        version_url: string;
        changelog_url: string;
    } | boolean;

    types: string[];
    id: ObjectId | string;

    import: any;
}

export interface ContentInterface {
    _id: ObjectId;
    addon_id: ObjectId;
    permissions?: {
        roles?: { [key:string]:string[] }[];
        users?: { [key:string]:string[] }[];
    };
    type: string;
    owner?: ObjectId;
    content: any;
    history: {
        content: any, 
        owner?: ObjectId, 
        date: Date, 
        eason: string
    }[];
}

export interface IPhistoryInterface {
    _id: ObjectId;
    ip: string;
    banned: boolean;
    last_accessed: number;
    created: number;
    count: number;
    settings: {
        bypass_timeout: boolean;
        bypass_account_limit: boolean;
    };
    accounts: {
        user_id: ObjectId;  
        timestamp: number;      
    }[];
}

export interface IPobjectSettingsInterface { 
    bypass_account_limit?: boolean 
    bypass_timeout?: boolean
}

export interface SecurityOptionsInterface {
    ip: {
        max_per_ip: number;
        timeout: number;
    }

    security: {
        password_salt_rounds: number;
        token_salt_rounds: number;
        token_expiration: number;
        token_cache_ttl: number;
        token_cache: boolean;
        token_length: number;
        max_attempts: number;
        max_login_history: number;
    }
}

export interface EmailContentInterface {
    to: string;
    from: string;
    cc?: string;
    subject: string;
    body: string;   
}

export interface EmailFunctionInterface {
    func (content: EmailContentInterface): Promise<boolean | ErrorInterface>;    
}

export interface DiscordOauth2Interface {
    client_id: string;
    client_secret: string;      
    redirect_uri: string;
    scopes: string[];
}

export interface DiscordBearerInterface {
    access_token: string;
    refresh_token: string;
    expires_at: number;
    expires_in: number;
    token_type: string;
    scope: string[];
    combined: string;
}   

export interface DiscordUserInterface {
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
    email?: string;
    verified: boolean;      
    mfa_enabled: boolean;
    locale: string;
    flags: number;
}

export interface OauthInterface {
    _id: ObjectId;
    type: string;
    oauth_id: string;
    user_id: ObjectId;
}

export interface RoleInterface {
    _id: ObjectId;
    name: string;
    color?: string;
    description?: string;
    core: boolean;  
    permissions: Array<{
        value: number, 
        _id:ObjectId,
        locked?: boolean,
    }>
}

export interface GlobalRoleObjectInterface {
    _id: ObjectId,  
    core_permissions: Array<{
        _id: ObjectId,
        name: string,
        description: string,
    }>,
    addon_permissions?: Array<{
        permission_id: ObjectId,
        name: string,
        _id: ObjectId,
    }>,
    roles: Array<RoleInterface>,
    precedence: {
        [role_precedence:number]: ObjectId,
    }
}