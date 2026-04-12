// lib/api.js

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiService = {
  /**
   * Envía la configuración inicial del cliente (Nombre, Prompt, Tokens de Meta)
   */
  saveOnboarding: async (data, clientId) => {
    try {
      const response = await fetch(`${API_URL}/onboarding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'client-id': clientId // Identificador del dueño del negocio
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Error en el Onboarding');
      return await response.json();
    } catch (error) {
      console.error("Error apiService.saveOnboarding:", error);
      throw error;
    }
  },

  /**
   * Envía un nuevo producto o curso a la tabla saas_products
   */
  saveProduct: async (product, clientId) => {
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'client-id': clientId
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) throw new Error('Error al guardar el producto');
      return await response.json();
    } catch (error) {
      console.error("Error apiService.saveProduct:", error);
      throw error;
    }
  }
};