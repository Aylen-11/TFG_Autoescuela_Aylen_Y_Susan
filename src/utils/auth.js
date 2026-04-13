
/** Estas dos funciones evitan repetir ese código en cada componente. */
export function obtenerUsername() {
  const auth = localStorage.getItem("auth");
  if (!auth) return null;
  const decoded = atob(auth);
  const [user] = decoded.split(":");
  return user;
}

export function obtenerAuthHeaders() {
  const auth = localStorage.getItem("auth");
  if (!auth) return null;
  return {
    "Authorization": "Basic " + auth,
    "Content-Type": "application/json"
  };
}
/**cuando el usuario se loguea guarda sus credenciales en Base64 
 * en el localstorage con la clave auth.
 *  luego cada vez que se hace  un fetch al backend ocupamos mandar esas credenciales en la cabecera 
 * para que el Spring sepa que esta autorizado */