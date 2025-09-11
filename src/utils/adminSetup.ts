import { supabase } from "@/integrations/supabase/client";

export async function createAdminUser() {
  try {
    // Create the admin user with email and password
    const { data, error } = await supabase.auth.signUp({
      email: 'admin@procar.com',
      password: 'procar',
      options: {
        data: {
          name: 'Administrador'
        },
        emailRedirectTo: `${window.location.origin}/`
      }
    });

    if (error) {
      console.error('Error creating admin user:', error);
      return { success: false, error: error.message };
    }

    // Call the database function to set up workshop settings
    const { error: functionError } = await supabase.rpc('create_admin_user');
    
    if (functionError) {
      console.error('Error setting up admin settings:', functionError);
    }

    return { 
      success: true, 
      user: data.user,
      message: 'Usuário administrador criado com sucesso!'
    };
  } catch (error) {
    console.error('Unexpected error creating admin user:', error);
    return { 
      success: false, 
      error: 'Erro inesperado ao criar usuário administrador'
    };
  }
}