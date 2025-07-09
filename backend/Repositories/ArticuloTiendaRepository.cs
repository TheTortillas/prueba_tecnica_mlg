using backend.Data;
using backend.DTOs;
using backend.Interfaces;
using System.Data;
using System.Data.SqlClient;

namespace backend.Repositories
{
    public class ArticuloTiendaRepository : IArticuloTiendaRepository
    {
        private readonly DatabaseConnection _databaseConnection;

        public ArticuloTiendaRepository(DatabaseConnection databaseConnection)
        {
            _databaseConnection = databaseConnection;
        }

        public async Task<IEnumerable<ArticuloTiendaDto>> GetAllAsync()
        {
            var articuloTiendas = new List<ArticuloTiendaDto>();

            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var command = new SqlCommand("SP_ArticuloTienda_GetAll", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                articuloTiendas.Add(new ArticuloTiendaDto
                {
                    ArticuloTiendaId = reader.GetInt32("ArticuloTiendaId"),
                    ArticuloId = reader.GetInt32("ArticuloId"),
                    TiendaId = reader.GetInt32("TiendaId"),
                    Fecha = reader.GetDateTime("Fecha"),
                    StockTienda = reader.GetInt32("StockTienda")
                });
            }

            return articuloTiendas;
        }

        public async Task<ArticuloTiendaDto?> GetByIdAsync(int id)
        {
            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var command = new SqlCommand("SP_ArticuloTienda_GetById", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@ArticuloTiendaId", id);

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new ArticuloTiendaDto
                {
                    ArticuloTiendaId = reader.GetInt32("ArticuloTiendaId"),
                    ArticuloId = reader.GetInt32("ArticuloId"),
                    TiendaId = reader.GetInt32("TiendaId"),
                    Fecha = reader.GetDateTime("Fecha"),
                    StockTienda = reader.GetInt32("StockTienda")
                };
            }

            return null;
        }

        public async Task<IEnumerable<ArticuloTiendaDto>> GetByTiendaAsync(int tiendaId)
        {
            var articuloTiendas = new List<ArticuloTiendaDto>();

            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var command = new SqlCommand("SP_ArticuloTienda_GetByTienda", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@TiendaId", tiendaId);

            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                articuloTiendas.Add(new ArticuloTiendaDto
                {
                    ArticuloTiendaId = reader.GetInt32("ArticuloTiendaId"),
                    ArticuloId = reader.GetInt32("ArticuloId"),
                    TiendaId = reader.GetInt32("TiendaId"),
                    Fecha = reader.GetDateTime("Fecha"),
                    StockTienda = reader.GetInt32("StockTienda")
                });
            }

            return articuloTiendas;
        }

        public async Task<IEnumerable<ArticuloTiendaDto>> GetByArticuloAsync(int articuloId)
        {
            var articuloTiendas = new List<ArticuloTiendaDto>();

            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var command = new SqlCommand("SP_ArticuloTienda_GetByArticulo", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@ArticuloId", articuloId);

            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                articuloTiendas.Add(new ArticuloTiendaDto
                {
                    ArticuloTiendaId = reader.GetInt32("ArticuloTiendaId"),
                    ArticuloId = reader.GetInt32("ArticuloId"),
                    TiendaId = reader.GetInt32("TiendaId"),
                    Fecha = reader.GetDateTime("Fecha"),
                    StockTienda = reader.GetInt32("StockTienda")
                });
            }

            return articuloTiendas;
        }

        public async Task<ArticuloTiendaDto> CreateAsync(ArticuloTiendaCreateDto articuloTiendaCreateDto)
        {
            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var command = new SqlCommand("SP_ArticuloTienda_Create", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@ArticuloId", articuloTiendaCreateDto.ArticuloId);
            command.Parameters.AddWithValue("@TiendaId", articuloTiendaCreateDto.TiendaId);
            command.Parameters.AddWithValue("@StockTienda", articuloTiendaCreateDto.StockTienda);

            var articuloTiendaIdParam = new SqlParameter("@ArticuloTiendaId", SqlDbType.Int)
            {
                Direction = ParameterDirection.Output
            };
            command.Parameters.Add(articuloTiendaIdParam);

            await command.ExecuteNonQueryAsync();

            var articuloTiendaId = (int)articuloTiendaIdParam.Value;
            var articuloTienda = await GetByIdAsync(articuloTiendaId);
            return articuloTienda!;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var command = new SqlCommand("SP_ArticuloTienda_Delete", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@ArticuloTiendaId", id);

            var rowsAffected = await command.ExecuteNonQueryAsync();
            return rowsAffected > 0;
        }

        public async Task<bool> ExistsAsync(int articuloId, int tiendaId)
        {
            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var command = new SqlCommand("SP_ArticuloTienda_Exists", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@ArticuloId", articuloId);
            command.Parameters.AddWithValue("@TiendaId", tiendaId);

            var existsParam = new SqlParameter("@Exists", SqlDbType.Bit)
            {
                Direction = ParameterDirection.Output
            };
            command.Parameters.Add(existsParam);

            await command.ExecuteNonQueryAsync();
            return (bool)existsParam.Value;
        }

        public async Task<bool> UpdateStockAsync(int articuloId, int tiendaId, int nuevoStock)
        {
            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var command = new SqlCommand("SP_ArticuloTienda_UpdateStock", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@ArticuloId", articuloId);
            command.Parameters.AddWithValue("@TiendaId", tiendaId);
            command.Parameters.AddWithValue("@NuevoStock", nuevoStock);

            var rowsAffected = await command.ExecuteNonQueryAsync();
            return rowsAffected > 0;
        }
    }
}
