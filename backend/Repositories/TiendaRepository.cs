using backend.Data;
using backend.DTOs;
using backend.Interfaces;
using System.Data;
using System.Data.SqlClient;

namespace backend.Repositories
{
    public class TiendaRepository : ITiendaRepository
    {
        private readonly DatabaseConnection _databaseConnection;

        public TiendaRepository(DatabaseConnection databaseConnection)
        {
            _databaseConnection = databaseConnection;
        }

        public async Task<IEnumerable<TiendaDto>> GetAllAsync()
        {
            var tiendas = new List<TiendaDto>();

            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var command = new SqlCommand("SP_Tienda_GetAll", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                tiendas.Add(new TiendaDto
                {
                    TiendaId = reader.GetInt32("TiendaId"),
                    Sucursal = reader.GetString("Sucursal"),
                    Direccion = reader.GetString("Direccion"),
                    FechaCreacion = reader.GetDateTime("FechaCreacion"),
                    Activo = reader.GetBoolean("Activo")
                });
            }

            return tiendas;
        }

        public async Task<TiendaDto?> GetByIdAsync(int id)
        {
            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var command = new SqlCommand("SP_Tienda_GetById", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@TiendaId", id);

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new TiendaDto
                {
                    TiendaId = reader.GetInt32("TiendaId"),
                    Sucursal = reader.GetString("Sucursal"),
                    Direccion = reader.GetString("Direccion"),
                    FechaCreacion = reader.GetDateTime("FechaCreacion"),
                    Activo = reader.GetBoolean("Activo")
                };
            }

            return null;
        }

        public async Task<TiendaDto> CreateAsync(TiendaCreateDto tiendaCreateDto)
        {
            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var command = new SqlCommand("SP_Tienda_Create", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@Sucursal", tiendaCreateDto.Sucursal);
            command.Parameters.AddWithValue("@Direccion", tiendaCreateDto.Direccion);

            var tiendaIdParam = new SqlParameter("@TiendaId", SqlDbType.Int)
            {
                Direction = ParameterDirection.Output
            };
            command.Parameters.Add(tiendaIdParam);

            await command.ExecuteNonQueryAsync();

            var tiendaId = (int)tiendaIdParam.Value;
            var tienda = await GetByIdAsync(tiendaId);
            return tienda!;
        }

        public async Task<TiendaDto?> UpdateAsync(int id, TiendaUpdateDto tiendaUpdateDto)
        {
            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var command = new SqlCommand("SP_Tienda_Update", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@TiendaId", id);
            command.Parameters.AddWithValue("@Sucursal", tiendaUpdateDto.Sucursal);
            command.Parameters.AddWithValue("@Direccion", tiendaUpdateDto.Direccion);

            var rowsAffected = await command.ExecuteNonQueryAsync();
            if (rowsAffected > 0)
            {
                return await GetByIdAsync(id);
            }

            return null;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var command = new SqlCommand("SP_Tienda_Delete", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@TiendaId", id);

            var rowsAffected = await command.ExecuteNonQueryAsync();
            return rowsAffected > 0;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var command = new SqlCommand("SP_Tienda_Exists", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@TiendaId", id);

            var existsParam = new SqlParameter("@Exists", SqlDbType.Bit)
            {
                Direction = ParameterDirection.Output
            };
            command.Parameters.Add(existsParam);

            await command.ExecuteNonQueryAsync();
            return (bool)existsParam.Value;
        }
    }
}
