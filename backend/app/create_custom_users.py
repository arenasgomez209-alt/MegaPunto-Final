import asyncio
from datetime import datetime, timezone
from app.database import users_collection
from app.security import hash_password

async def main():
    users_to_upsert = [
        {
            "nombre": "Matias",
            "apellido": "Arenas",
            "tipoDocumento": "CC",
            "numeroDocumento": "1023456789",
            "direccion": "Calle Principal # 12-34",
            "telefono": "3046408290",
            "email": "arenasgomez209@gmail.com",
            "password": hash_password("1023"),
            "rol": "Administrador",
            "estado": "Activo",
            "fechaCreacion": datetime.now(timezone.utc).isoformat()
        },
        {
            "nombre": "Laura",
            "apellido": "Gómez",
            "tipoDocumento": "CC",
            "numeroDocumento": "1098765432",
            "direccion": "Carrera 45 # 67-89",
            "telefono": "3109876543",
            "email": "laura.empleado@megapunto.com",
            "password": hash_password("1023"),
            "rol": "Empleado",
            "estado": "Activo",
            "fechaCreacion": datetime.now(timezone.utc).isoformat()
        }
    ]

    for u in users_to_upsert:
        res = await users_collection.update_one(
            {"email": u["email"]},
            {"$set": u},
            upsert=True
        )
        print(f"Usuario {u['email']} guardado con rol '{u['rol']}' y contrasena '1023'. Modificados: {res.modified_count}, Insertados: {res.upserted_id is not None}")

if __name__ == "__main__":
    asyncio.run(main())
