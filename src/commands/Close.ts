import { BuilderComponent, RegisterCommand } from '@seedcord/gateway';

@RegisterCommand()
export class Close extends BuilderComponent<'command'> {
    constructor() {
        super('command');

        this.instance.setName('close').setDescription('Close the current support ticket.');
    }
}
