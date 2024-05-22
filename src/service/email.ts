import environment from '@/libraries/environment';
import { Resend } from 'resend';

const email = new Resend(environment.resend);
export const emailFrom = 'noreply@waboo.com.br';

export default email;
