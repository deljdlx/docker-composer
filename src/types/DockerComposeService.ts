import YAML from "yaml";

export interface DockerComposeServiceInterface {
    id?: string
    container_name?: string;
    image?: string;
    build?: {
        context: string;
        dockerfile: string;
    };
    environment?: string[];
    ports?: string[];
    labels?: string[];
    depends_on?: string[];
    volumes?: string[];
    networks?: string[];
}

export class DockerComposeService implements DockerComposeServiceInterface {
    id?: string;
    container_name?: string;
    image?: string;
    build?: {
        context: string;
        dockerfile: string;
    };
    environment?: string[];
    ports?: string[];
    labels?: string[];
    depends_on?: string[];
    volumes?: string[];
    networks?: string[];

    [key: string]: any;

    constructor(id?: string, descriptor?: any) {
        this.id = id;
        if(descriptor) {
            Object.keys(this).forEach((attributeName) => {
                if (descriptor && descriptor[attributeName]) {
                    this[attributeName] = descriptor[attributeName];
                }
            });
        }
    }
    getYaml() {
        const fields = {...this};
        delete fields.id;
        return YAML.stringify(fields)
    }
}


