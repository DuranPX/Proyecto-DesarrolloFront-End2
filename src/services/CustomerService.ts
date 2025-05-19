import { createModel } from "./modelsService";
import { setUser, UserState } from "../store/userSlice";
import { AppDispatch, RootState } from "../store/store";

const API_URL_CUSTOMERS = "http://127.0.0.1:5000/customers";

// Buscar customer por email usando el nuevo endpoint
export const fetchCustomerByEmail = async (email: string) => {
    const response = await fetch(`${API_URL_CUSTOMERS}/email/${encodeURIComponent(email)}`);
    console.log("Respuesta del backend al buscar cliente por email:", response);
    if (response.ok) {
        const customer = await response.json();
        return customer; // null si no existe
    }
    return null;
};

// Crea el customer solo si no existe, si existe lo trae y actualiza el store
export const createCustomerOnLogin = (userData: UserState) => {
    return async (dispatch: AppDispatch, getState: () => RootState) => {
        console.log("Datos del usuario al iniciar sesión:", userData);
        try {
            // Buscar siempre por email antes de crear
            if (userData.email) {
                const existingCustomer = await fetchCustomerByEmail(userData.email);
                console.log("Cliente existente:", existingCustomer);
                if (existingCustomer && existingCustomer.id) {
                    dispatch(setUser({
                        ...userData,
                        id: Number(existingCustomer.id),
                        name: existingCustomer.name,
                        phone: existingCustomer.phone,
                        // Puedes agregar más campos si tu backend los retorna
                    }));
                    return;
                }
            } else {
                // Si no hay email, no se puede hacer nada más
                return;
            }

            // Si no existe, crea el customer
            const customerData = {
                name: userData.name,
                email: userData.email,
                phone: userData.phone || "Sin teléfono",
            };
            console.log("Datos del cliente a crear:", customerData);
            const response = await createModel(API_URL_CUSTOMERS, customerData);
            console.log("Respuesta del backend al crear cliente:", response);
            if (response.ok) {
                const newCustomer = await response.json();
                console.log("Cliente creado exitosamente en el backend:", newCustomer);

                const currentUser = getState().user;

                const updatedUser: UserState = {
                    ...userData,
                    id: newCustomer.id ? Number(newCustomer.id) : currentUser?.id || null,
                    token: currentUser?.token || userData.token || "",
                    provider: currentUser?.provider || userData.provider || "",
                    phone: newCustomer.phone ?? userData.phone ?? currentUser?.phone ?? null,
                };
                console.log("Usuario actualizado:", updatedUser);

                dispatch(setUser(updatedUser));
            } else {
                console.error("Error al crear el cliente en el backend:", response.status);
            }
        } catch (error) {
            console.error("Error al crear el cliente en el backend:", error);
        }
    };
};
export function hasRequiredUserData(user: Partial<UserState>): boolean {
    return !!(user.name && user.email && user.phone);
}