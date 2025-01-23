import { DockerComposeService } from './DockerComposeService';

import YAML from "yaml";

export interface DockerComposeConfigurationInterface {
    yaml?: string;
    services?: { [key: string]: DockerComposeService } ;
    setService: (serviceId: string, service: DockerComposeService) => void;
    getServiceById:(serviceId: string) => DockerComposeService | null;
    setYaml: (yaml: string) => void;
}

export class DockerComposeConfiguration implements DockerComposeConfigurationInterface {
    yaml?: string;
    descriptor?: any;


    services: {
        [key: string]: DockerComposeService
    } = {};

    setYaml(yaml: string) {
        this.yaml = yaml;
        this.loadFromContent(yaml);
    }

    setService(serviceId: string, service: DockerComposeService) {
        this.services[serviceId] = service;
        Object.keys(this.services).map((serviceId) => {
            this.descriptor.services[serviceId] = this.services[serviceId];
        });
        this.yaml = YAML.stringify(this.descriptor);
    }

    getServiceById(serviceId: string) {
        if(this.services[serviceId]) {
            return this.services[serviceId];
        }

        return null
    }



    constructor(yaml?: string) {
        this.yaml = yaml;
        if (yaml) {
            this.loadFromContent(yaml);
        }

    }

    loadFromContent(content: string) {
        this.descriptor = YAML.parse(content);
        if(this.descriptor) {
            Object.keys(this.descriptor.services).map((serviceId) => {
                const service = new DockerComposeService(
                    serviceId,
                    this.descriptor.services[serviceId]
                );
                this.services[serviceId] = service;
            });
        }
    }
}
