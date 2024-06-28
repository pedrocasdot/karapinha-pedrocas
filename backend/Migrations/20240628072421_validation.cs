using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class validation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Time",
                table: "Profissionais");

            migrationBuilder.AlterColumn<string>(
                name: "horario",
                table: "ProfissionalHorarios",
                type: "varchar(5)",
                maxLength: 5,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "horario",
                table: "ProfissionalHorarios",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(5)",
                oldMaxLength: 5);

            migrationBuilder.AddColumn<string>(
                name: "Time",
                table: "Profissionais",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
