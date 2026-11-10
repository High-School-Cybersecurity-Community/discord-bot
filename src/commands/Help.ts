import { BuilderComponent, RegisterCommand } from '@seedcord/gateway';

@RegisterCommand()
export class Help extends BuilderComponent<'command'> {
    constructor() {
        super('command');

        this.instance.setName('help').setDescription('Display help message');
    }
}
