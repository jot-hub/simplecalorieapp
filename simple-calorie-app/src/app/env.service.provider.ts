import { EnvService } from "./env.service";

export const EnvServiceFactory = () => {

    const env = new EnvService();
  
    const browserWindow = window || {};
    const browserWindowEnv = (browserWindow as any)['__env'] || {};
  
 
    for(const key in browserWindowEnv) {
        if(browserWindowEnv.hasOwnProperty(key)) {
            if(key == "dailyLimit") env.dailyLimit = browserWindowEnv[key];
            if(key == "role") env.role = browserWindowEnv[key];
            if(key == "email") env.email = browserWindowEnv[key];
        }
    }
  
    return env;
  };

  export const EnvServiceProvider =
  { provide: EnvService,
    useFactory: EnvServiceFactory,
    deps: []
  };