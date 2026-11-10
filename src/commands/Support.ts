import { BuilderComponent, RegisterCommand } from '@seedcord/gateway';

@RegisterCommand()
export class Support extends BuilderComponent<'command'> {
    constructor() {
        super('command');

        this.instance.setName('support').setDescription('Refresh the support panel');
    }
}
