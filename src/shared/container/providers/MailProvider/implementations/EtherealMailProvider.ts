import nodemailer, { Transporter } from 'nodemailer';

class EtherealMailProvider {

    private client: Transporter;

    constructor() {
        nodemailer.createTestAccount().then(account => {
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                }
            });

            console.log(account);
            this.client = transporter;
        });
    }

    public async sendMail(to: string, body: string): Promise<void> {
        const message = await this.client.sendMail({
            from: 'Sender Name <sender@example.com>',
            to,
            subject: 'Recuperacao de senha ✔',
            text: body,
            html: 'Pedido de recuperacao de senha recebido'
        });

        console.log('Message sent : %s', message.messageId);
        console.log('Preview URL : %s', nodemailer.getTestMessageUrl(message));

    }

}

export default EtherealMailProvider;
