using backend.Data;
using backend.DTOs;
using backend.Interfaces;
using System.Data;
using System.Data.SqlClient;

namespace backend.Repositories
{
    public class ClienteArticuloRepository : IClienteArticuloRepository
    {
        private readonly DatabaseConnection _databaseConnection;
        private readonly IArticuloRepository _articuloRepository;

        public ClienteArticuloRepository(DatabaseConnection databaseConnection, IArticuloRepository articuloRepository)
        {
            _databaseConnection = databaseConnection;
            _articuloRepository = articuloRepository;
        }

        public async Task<IEnumerable<ClienteArticuloDto>> GetAllAsync()
        {
            var clienteArticulos = new List<ClienteArticuloDto>();

            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var command = new SqlCommand("SP_ClienteArticulo_GetAll", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                clienteArticulos.Add(new ClienteArticuloDto
                {
                    ClienteArticuloId = reader.GetInt32("ClienteArticuloId"),
                    ClienteId = reader.GetInt32("ClienteId"),
                    ArticuloId = reader.GetInt32("ArticuloId"),
                    Fecha = reader.GetDateTime("Fecha"),
                    Cantidad = reader.GetInt32("Cantidad"),
                    PrecioUnitario = reader.GetDecimal("PrecioUnitario"),
                    Total = reader.GetDecimal("Total")
                });
            }

            return clienteArticulos;
        }

        public async Task<ClienteArticuloDto?> GetByIdAsync(int id)
        {
            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var command = new SqlCommand("SP_ClienteArticulo_GetById", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@ClienteArticuloId", id);

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new ClienteArticuloDto
                {
                    ClienteArticuloId = reader.GetInt32("ClienteArticuloId"),
                    ClienteId = reader.GetInt32("ClienteId"),
                    ArticuloId = reader.GetInt32("ArticuloId"),
                    Fecha = reader.GetDateTime("Fecha"),
                    Cantidad = reader.GetInt32("Cantidad"),
                    PrecioUnitario = reader.GetDecimal("PrecioUnitario"),
                    Total = reader.GetDecimal("Total")
                };
            }

            return null;
        }

        public async Task<IEnumerable<ClienteArticuloDto>> GetByClienteIdAsync(int clienteId)
        {
            var clienteArticulos = new List<ClienteArticuloDto>();

            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var command = new SqlCommand("SP_ClienteArticulo_GetByCliente", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@ClienteId", clienteId);

            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                clienteArticulos.Add(new ClienteArticuloDto
                {
                    ClienteArticuloId = reader.GetInt32("ClienteArticuloId"),
                    ClienteId = reader.GetInt32("ClienteId"),
                    ArticuloId = reader.GetInt32("ArticuloId"),
                    Fecha = reader.GetDateTime("Fecha"),
                    Cantidad = reader.GetInt32("Cantidad"),
                    PrecioUnitario = reader.GetDecimal("PrecioUnitario"),
                    Total = reader.GetDecimal("Total")
                });
            }

            return clienteArticulos;
        }

        public async Task<IEnumerable<ClienteArticuloDto>> GetByArticuloIdAsync(int articuloId)
        {
            var clienteArticulos = new List<ClienteArticuloDto>();

            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var command = new SqlCommand("SP_ClienteArticulo_GetByArticulo", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@ArticuloId", articuloId);

            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                clienteArticulos.Add(new ClienteArticuloDto
                {
                    ClienteArticuloId = reader.GetInt32("ClienteArticuloId"),
                    ClienteId = reader.GetInt32("ClienteId"),
                    ArticuloId = reader.GetInt32("ArticuloId"),
                    Fecha = reader.GetDateTime("Fecha"),
                    Cantidad = reader.GetInt32("Cantidad"),
                    PrecioUnitario = reader.GetDecimal("PrecioUnitario"),
                    Total = reader.GetDecimal("Total")
                });
            }

            return clienteArticulos;
        }

        public async Task<ClienteArticuloDto> CreateAsync(ClienteArticuloCreateDto clienteArticuloCreateDto)
        {
            var articulo = await _articuloRepository.GetByIdAsync(clienteArticuloCreateDto.ArticuloId);
            if (articulo == null)
                throw new ArgumentException("Artículo no encontrado");

            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var command = new SqlCommand("SP_ClienteArticulo_Create", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@ClienteId", clienteArticuloCreateDto.ClienteId);
            command.Parameters.AddWithValue("@ArticuloId", clienteArticuloCreateDto.ArticuloId);
            command.Parameters.AddWithValue("@Cantidad", clienteArticuloCreateDto.Cantidad);
            command.Parameters.AddWithValue("@PrecioUnitario", articulo.Precio);

            var clienteArticuloIdParam = new SqlParameter("@ClienteArticuloId", SqlDbType.Int)
            {
                Direction = ParameterDirection.Output
            };
            command.Parameters.Add(clienteArticuloIdParam);

            await command.ExecuteNonQueryAsync();

            var clienteArticuloId = (int)clienteArticuloIdParam.Value;
            var clienteArticulo = await GetByIdAsync(clienteArticuloId);
            return clienteArticulo!;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var command = new SqlCommand("SP_ClienteArticulo_Delete", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@ClienteArticuloId", id);

            var rowsAffected = await command.ExecuteNonQueryAsync();
            return rowsAffected > 0;
        }

        public async Task<CompraResponseDto> ProcesarCompraAsync(CompraRequestDto compraRequest)
        {
            var response = new CompraResponseDto();
            var compras = new List<ClienteArticuloDto>();
            decimal totalGeneral = 0;

            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var transaction = ((SqlConnection)connection).BeginTransaction();

            try
            {
                foreach (var item in compraRequest.Items)
                {
                    var articulo = await _articuloRepository.GetByIdAsync(item.ArticuloId);
                    if (articulo == null)
                    {
                        response.Exito = false;
                        response.Mensaje = $"Artículo con ID {item.ArticuloId} no encontrado";
                        return response;
                    }

                    if (articulo.Stock < item.Cantidad)
                    {
                        response.Exito = false;
                        response.Mensaje = $"Stock insuficiente para el artículo {articulo.Descripcion}";
                        return response;
                    }

                    using var command = new SqlCommand("SP_ClienteArticulo_ProcesarCompra", (SqlConnection)connection, transaction)
                    {
                        CommandType = CommandType.StoredProcedure
                    };

                    command.Parameters.AddWithValue("@ClienteId", compraRequest.ClienteId);
                    command.Parameters.AddWithValue("@ArticuloId", item.ArticuloId);
                    command.Parameters.AddWithValue("@Cantidad", item.Cantidad);
                    command.Parameters.AddWithValue("@PrecioUnitario", articulo.Precio);

                    var clienteArticuloIdParam = new SqlParameter("@ClienteArticuloId", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };
                    command.Parameters.Add(clienteArticuloIdParam);

                    await command.ExecuteNonQueryAsync();

                    var clienteArticuloId = (int)clienteArticuloIdParam.Value;

                    var compra = new ClienteArticuloDto
                    {
                        ClienteArticuloId = clienteArticuloId,
                        ClienteId = compraRequest.ClienteId,
                        ArticuloId = item.ArticuloId,
                        Cantidad = item.Cantidad,
                        PrecioUnitario = articulo.Precio,
                        Total = articulo.Precio * item.Cantidad,
                        Fecha = DateTime.Now,
                        Articulo = articulo
                    };

                    compras.Add(compra);
                    totalGeneral += compra.Total;
                }

                transaction.Commit();

                response.Exito = true;
                response.Mensaje = "Compra procesada exitosamente";
                response.Compras = compras;
                response.TotalGeneral = totalGeneral;
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                response.Exito = false;
                response.Mensaje = $"Error al procesar la compra: {ex.Message}";
            }

            return response;
        }

        public async Task<ClienteArticuloDto?> UpdateAsync(int id, ClienteArticuloUpdateDto clienteArticuloUpdateDto)
        {
            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var command = new SqlCommand("SP_ClienteArticulo_Update", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@ClienteArticuloId", id);
            command.Parameters.AddWithValue("@Cantidad", clienteArticuloUpdateDto.Cantidad);
            command.Parameters.AddWithValue("@PrecioUnitario", clienteArticuloUpdateDto.PrecioUnitario);

            var rowsAffected = await command.ExecuteNonQueryAsync();

            if (rowsAffected > 0)
            {
                return await GetByIdAsync(id);
            }

            return null;
        }

        public async Task<IEnumerable<ClienteArticuloDto>> GetHistorialComprasAsync(int clienteId)
        {
            var historial = new List<ClienteArticuloDto>();

            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var command = new SqlCommand("SP_ClienteArticulo_GetHistorial", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@ClienteId", clienteId);

            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                historial.Add(new ClienteArticuloDto
                {
                    ClienteArticuloId = reader.GetInt32("ClienteArticuloId"),
                    ClienteId = reader.GetInt32("ClienteId"),
                    ArticuloId = reader.GetInt32("ArticuloId"),
                    Fecha = reader.GetDateTime("Fecha"),
                    Cantidad = reader.GetInt32("Cantidad"),
                    PrecioUnitario = reader.GetDecimal("PrecioUnitario"),
                    Total = reader.GetDecimal("Total")
                });
            }

            return historial;
        }

        public async Task<object> GetEstadisticasClienteAsync(int clienteId)
        {
            using var connection = await _databaseConnection.CreateConnectionAsync();
            using var command = new SqlCommand("SP_ClienteArticulo_GetEstadisticas", (SqlConnection)connection)
            {
                CommandType = CommandType.StoredProcedure
            };
            command.Parameters.AddWithValue("@ClienteId", clienteId);

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new
                {
                    TotalCompras = reader.GetInt32("TotalCompras"),
                    MontoTotal = reader.GetDecimal("MontoTotal"),
                    ArticulosFavoritos = reader.IsDBNull("ArticulosFavoritos") ? null : reader.GetString("ArticulosFavoritos")
                };
            }

            return new { TotalCompras = 0, MontoTotal = 0.0m, ArticulosFavoritos = (string?)null };
        }
    }
}
