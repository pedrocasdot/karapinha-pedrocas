using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class modelUserConstraints : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_BI",
                table: "Usuarios",
                column: "BI",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_EnderecoEmail",
                table: "Usuarios",
                column: "EnderecoEmail",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_Telemovel",
                table: "Usuarios",
                column: "Telemovel",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_Username",
                table: "Usuarios",
                column: "Username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Usuarios_BI",
                table: "Usuarios");

            migrationBuilder.DropIndex(
                name: "IX_Usuarios_EnderecoEmail",
                table: "Usuarios");

            migrationBuilder.DropIndex(
                name: "IX_Usuarios_Telemovel",
                table: "Usuarios");

            migrationBuilder.DropIndex(
                name: "IX_Usuarios_Username",
                table: "Usuarios");
        }
    }
}
