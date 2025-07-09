using backend.Data;
using backend.DTOs;
using backend.Entities;
using backend.Interfaces;
using System.Data;
using System.Data.SqlClient;

namespace backend.Repositories
{
    public class ClienteRepository : IClienteRepository
    {
        private readonly DatabaseConnection _databaseConnection;

        public ClienteRepository(DatabaseConnection databaseConnection)
        {
            _databaseConnection = databaseConnection;
        }

        public async Task<IEnumerable<ClienteDto>> GetAllAsync()
        {
            var clientes = new List<ClienteDto>();

            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var command = new SqlCommand("SP_Cliente_GetAll", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                clientes.Add(new ClienteDto
                {
                    ClienteId = reader.GetInt32("ClienteId"),
                    Nombre = reader.GetString("Nombre"),
                    Apellidos = reader.GetString("Apellidos"),
                    Direccion = reader.GetString("Direccion"),
                    Email = reader.GetString("Email"),
                    FechaCreacion = reader.GetDateTime("FechaCreacion"),
                    Activo = reader.GetBoolean("Activo")
                });
            }

            return clientes;
        }

        public async Task<ClienteDto?> GetByIdAsync(int id)
        {
            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var command = new SqlCommand("SP_Cliente_GetById", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@ClienteId", id);

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new ClienteDto
                {
                    ClienteId = reader.GetInt32("ClienteId"),
                    Nombre = reader.GetString("Nombre"),
                    Apellidos = reader.GetString("Apellidos"),
                    Direccion = reader.GetString("Direccion"),
                    Email = reader.GetString("Email"),
                    FechaCreacion = reader.GetDateTime("FechaCreacion"),
                    Activo = reader.GetBoolean("Activo")
                };
            }

            return null;
        }

        public async Task<ClienteDto?> GetByEmailAsync(string email)
        {
            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var command = new SqlCommand("SP_Cliente_GetByEmail", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@Email", email);

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new ClienteDto
                {
                    ClienteId = reader.GetInt32("ClienteId"),
                    Nombre = reader.GetString("Nombre"),
                    Apellidos = reader.GetString("Apellidos"),
                    Direccion = reader.GetString("Direccion"),
                    Email = reader.GetString("Email"),
                    FechaCreacion = reader.GetDateTime("FechaCreacion"),
                    Activo = reader.GetBoolean("Activo")
                };
            }

            return null;
        }

        public async Task<ClienteDto> CreateAsync(ClienteCreateDto clienteCreateDto)
        {
            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var command = new SqlCommand("SP_Cliente_Create", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@Nombre", clienteCreateDto.Nombre);
            command.Parameters.AddWithValue("@Apellidos", clienteCreateDto.Apellidos);
            command.Parameters.AddWithValue("@Direccion", clienteCreateDto.Direccion);
            command.Parameters.AddWithValue("@Email", clienteCreateDto.Email);
            command.Parameters.AddWithValue("@PasswordHash", clienteCreateDto.Password);

            var clienteIdParam = new SqlParameter("@ClienteId", SqlDbType.Int)
            {
                Direction = ParameterDirection.Output
            };
            command.Parameters.Add(clienteIdParam);

            await command.ExecuteNonQueryAsync();

            var clienteId = (int)clienteIdParam.Value;
            var cliente = await GetByIdAsync(clienteId);
            return cliente!;
        }

        public async Task<ClienteDto?> UpdateAsync(int id, ClienteUpdateDto clienteUpdateDto)
        {
            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var command = new SqlCommand("SP_Cliente_Update", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@ClienteId", id);
            command.Parameters.AddWithValue("@Nombre", clienteUpdateDto.Nombre);
            command.Parameters.AddWithValue("@Apellidos", clienteUpdateDto.Apellidos);
            command.Parameters.AddWithValue("@Direccion", clienteUpdateDto.Direccion);
            command.Parameters.AddWithValue("@Email", clienteUpdateDto.Email);

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
            using var command = new SqlCommand("SP_Cliente_Delete", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@ClienteId", id);

            var rowsAffected = await command.ExecuteNonQueryAsync();
            return rowsAffected > 0;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var command = new SqlCommand("SP_Cliente_Exists", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@ClienteId", id);

            var existsParam = new SqlParameter("@Exists", SqlDbType.Bit)
            {
                Direction = ParameterDirection.Output
            };
            command.Parameters.Add(existsParam);

            await command.ExecuteNonQueryAsync();
            return (bool)existsParam.Value;
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var command = new SqlCommand("SP_Cliente_EmailExists", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@Email", email);

            var existsParam = new SqlParameter("@Exists", SqlDbType.Bit)
            {
                Direction = ParameterDirection.Output
            };
            command.Parameters.Add(existsParam);

            await command.ExecuteNonQueryAsync();
            return (bool)existsParam.Value;
        }

        public async Task<string?> GetPasswordHashByEmailAsync(string email)
        {
            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var command = new SqlCommand("SP_Cliente_GetByEmail", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@Email", email);

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return reader.GetString("PasswordHash");
            }

            return null;
        }
    }
}
