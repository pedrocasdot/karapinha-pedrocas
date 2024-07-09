using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class constraints : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Profissionais_BI",
                table: "Profissionais",
                column: "BI",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Profissionais_Telemovel",
                table: "Profissionais",
                column: "Telemovel",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Profissionais_BI",
                table: "Profissionais");

            migrationBuilder.DropIndex(
                name: "IX_Profissionais_Telemovel",
                table: "Profissionais");
        }
    }
}
