import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-foreground">Welcome to SmartCart</h2>
        <Auth
          supabaseClient={supabase}
          providers={[]} // You can add 'google', 'github', etc. here if you want social logins
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(var(--primary))',
                  brandAccent: 'hsl(var(--primary-foreground))',
                  inputBackground: 'hsl(var(--input))',
                  inputBorder: 'hsl(var(--border))',
                  inputBorderHover: 'hsl(var(--ring))',
                  inputBorderFocus: 'hsl(var(--ring))',
                  inputText: 'hsl(var(--foreground))',
                  inputPlaceholder: 'hsl(var(--muted-foreground))',
                  messageText: 'hsl(var(--foreground))',
                  messageBackground: 'hsl(var(--secondary))',
                  messageBorder: 'hsl(var(--border))',
                  anchorText: 'hsl(var(--primary))',
                  anchorTextHover: 'hsl(var(--primary-foreground))',
                },
              },
            },
          }}
          theme="light" // Using light theme, adjust if you have a dark mode toggle
          redirectTo={window.location.origin} // Redirects to the current origin (home page) after login
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email address',
                password_label: 'Your Password',
                email_input_placeholder: 'Your email address',
                password_input_placeholder: 'Your Password',
                button_label: 'Sign in',
                social_provider_text: 'Sign in with {{provider}}',
                link_text: 'Already have an account? Sign In',
              },
              sign_up: {
                email_label: 'Email address',
                password_label: 'Create a Password',
                email_input_placeholder: 'Your email address',
                password_input_placeholder: 'Create a Password',
                button_label: 'Sign up',
                social_provider_text: 'Sign up with {{provider}}',
                link_text: 'Don\'t have an account? Sign Up',
              },
              forgotten_password: {
                link_text: 'Forgot your password?',
                email_label: 'Email address',
                password_reset_button_label: 'Send reset password instructions',
                back_to_sign_in_text: 'Back to sign in',
              },
              update_password: {
                password_label: 'New Password',
                password_input_placeholder: 'Your New Password',
                button_label: 'Update Password',
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Login;