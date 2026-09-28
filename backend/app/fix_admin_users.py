import asyncio
from datetime import datetime, timezone
from app.database import users_collection
from app.security import hash_password

async def main():
    print("=" * 60)
    print("  GESTION DE USUARIOS ADMINISTRADORES - MEGAPUNTO")
    print("=" * 60)

    # --- 1. Eliminar el admin del SENA ---
    email_sena = "admin@megapunto.com"
    result_delete = await users_collection.delete_one({"email": email_sena})
    if result_delete.deleted_count > 0:
        print(f"\n[OK] Usuario ELIMINADO: {email_sena} (Juan Administrador SENA)")
    else:
        print(f"\n[!] Usuario no encontrado en BD (ya fue eliminado?): {email_sena}")

    # --- 2. Resetear / asegurar tu admin con contrasena 1023 ---
    mi_email = "arenasgomez209@gmail.com"
    nueva_password = hash_password("1023")

    result_update = await users_collection.update_one(
        {"email": mi_email},
        {
            "$set": {
                "nombre": "Matias",
                "apellido": "Arenas",
                "tipoDocumento": "CC",
                "numeroDocumento": "1023456789",
                "direccion": "Calle Principal # 12-34",
                "telefono": "3046408290",
                "email": mi_email,
                "password": nueva_password,
                "rol": "Administrador",
                "estado": "Activo",
                "fechaCreacion": datetime.now(timezone.utc).isoformat()
            }
        },
        upsert=True
    )

    if result_update.upserted_id:
        print(f"[OK] Usuario CREADO: {mi_email} con contrasena '1023'")
    elif result_update.modified_count > 0:
        print(f"[OK] Contrasena RESETEADA: {mi_email} -> nueva contrasena: '1023'")
    else:
        print(f"[*] Usuario {mi_email} ya estaba actualizado (sin cambios).")

    # --- 3. Listar todos los admins actuales para verificar ---
    print("\n--- Administradores activos en BD ---")
    admins = await users_collection.find({"rol": "Administrador"}).to_list(length=100)
    if admins:
        for a in admins:
            print(f"  - {a.get('email')} | Nombre: {a.get('nombre')} {a.get('apellido')} | Estado: {a.get('estado')}")
    else:
        print("  (No se encontraron administradores)")

    print("\n[OK] Proceso completado exitosamente.")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(main())
