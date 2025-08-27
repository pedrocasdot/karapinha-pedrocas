using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class initial_ : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Marcacoes_Profissionais_ProfissionalId",
                table: "Marcacoes");

            migrationBuilder.DropForeignKey(
                name: "FK_Marcacoes_Servicos_ServiceId",
                table: "Marcacoes");

            migrationBuilder.DropIndex(
                name: "IX_Marcacoes_ProfissionalId",
                table: "Marcacoes");

            migrationBuilder.DropIndex(
                name: "IX_Marcacoes_ServiceId",
                table: "Marcacoes");

            migrationBuilder.DropColumn(
                name: "AppointmentDate",
                table: "Marcacoes");

            migrationBuilder.DropColumn(
                name: "ProfissionalId",
                table: "Marcacoes");

            migrationBuilder.DropColumn(
                name: "ServiceId",
                table: "Marcacoes");

            migrationBuilder.DropColumn(
                name: "Time",
                table: "Marcacoes");

            migrationBuilder.AddColumn<decimal>(
                name: "ValorTotal",
                table: "Marcacoes",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateTable(
                name: "AppointmentItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Time = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AppointmentDate = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ServiceId = table.Column<int>(type: "int", nullable: true),
                    ProfissionalId = table.Column<int>(type: "int", nullable: true),
                    AppointmentId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppointmentItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppointmentItems_Marcacoes_AppointmentId",
                        column: x => x.AppointmentId,
                        principalTable: "Marcacoes",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_AppointmentItems_Profissionais_ProfissionalId",
                        column: x => x.ProfissionalId,
                        principalTable: "Profissionais",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_AppointmentItems_Servicos_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "Servicos",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentItems_AppointmentId",
                table: "AppointmentItems",
                column: "AppointmentId");

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentItems_ProfissionalId",
                table: "AppointmentItems",
                column: "ProfissionalId");

            migrationBuilder.CreateIndex(
                name: "IX_AppointmentItems_ServiceId",
                table: "AppointmentItems",
                column: "ServiceId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppointmentItems");

            migrationBuilder.DropColumn(
                name: "ValorTotal",
                table: "Marcacoes");

            migrationBuilder.AddColumn<string>(
                name: "AppointmentDate",
                table: "Marcacoes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "ProfissionalId",
                table: "Marcacoes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ServiceId",
                table: "Marcacoes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Time",
                table: "Marcacoes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Marcacoes_ProfissionalId",
                table: "Marcacoes",
                column: "ProfissionalId");

            migrationBuilder.CreateIndex(
                name: "IX_Marcacoes_ServiceId",
                table: "Marcacoes",
                column: "ServiceId");

            migrationBuilder.AddForeignKey(
                name: "FK_Marcacoes_Profissionais_ProfissionalId",
                table: "Marcacoes",
                column: "ProfissionalId",
                principalTable: "Profissionais",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Marcacoes_Servicos_ServiceId",
                table: "Marcacoes",
                column: "ServiceId",
                principalTable: "Servicos",
                principalColumn: "Id");
        }
    }
}
