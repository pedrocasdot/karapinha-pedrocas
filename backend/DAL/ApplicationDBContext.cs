using backend.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;

namespace backend.DAL
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions dbContextOptions) : base(dbContextOptions)
        {
            
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Profissional> Profissionals { get; set; }
        public DbSet<ProfissionalHorario> ProfissionalHorarios { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

             modelBuilder.Entity<Category>()
                .HasIndex(u => u.Name).IsUnique();

            modelBuilder.Entity<Service>()
                .HasIndex(u => u.ServiceName).IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.EnderecoEmail).IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username).IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.BI).IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Telemovel).IsUnique();

            modelBuilder.Entity<User>()
               .HasIndex(u => u.EnderecoEmail).IsUnique();

            modelBuilder.Entity<Profissional>()
                .HasIndex(u => u.BI).IsUnique();

            modelBuilder.Entity<Profissional>()
                .HasIndex(u => u.BI).IsUnique();

            

            modelBuilder.Entity<Profissional>()
                .HasIndex(u => u.Telemovel).IsUnique();

            modelBuilder.Entity<User>()
                .Property(u => u.Username)
                .IsRequired()
                .HasMaxLength(50);

            modelBuilder.Entity<User>()
                .Property(u => u.Password)
                .IsRequired()
                .HasMaxLength(100);


            modelBuilder.Entity<User>()
                 .Property(u => u.EnderecoEmail)
                 .IsRequired()
                 .HasMaxLength(100);

            modelBuilder.Entity<User>()
                .Property(u => u.BI)
                .IsRequired()
                .HasMaxLength(15)
                .HasAnnotation("RegularExpression", @"^\d{8}[A-Z]{2}\d{3}$");

            modelBuilder.Entity<Service>()
               .HasIndex(u => u.ServiceName)
               .IsUnique();

            modelBuilder.Entity<Profissional>()
               .HasIndex(u => u.Email)
               .IsUnique();

            modelBuilder.Entity<Category>()
               .HasIndex(u => u.Name)
               .IsUnique();

            modelBuilder.Entity<Service>()
                .HasOne(s => s.Category)
                .WithMany(c => c.Services)
                .HasForeignKey(s => s.CategoryId);

            modelBuilder.Entity<User>()
               .Property(u => u.Telemovel)
               .IsRequired()
               .HasMaxLength(9)
               .HasAnnotation("RegularExpression", @"^\d{9}$");

            modelBuilder.Entity<ProfissionalHorario>()
                   .Property(e => e.horario)
                   .IsRequired()
                   .HasMaxLength(5)
                   .HasConversion(
                       v => v,
                       v => v)
                   .HasColumnType("varchar(5)")
                   .HasAnnotation("RegularExpression", @"^(09:00|09:30|10:00|10:30|11:00|11:30|12:00|12:30|13:00|13:30|14:00|14:30|15:00|15:30|16:00|16:30|17:00|17:30|18:00|18:30|19:00|19:30)$");


            modelBuilder.Entity<Appointment>()
                .HasOne(s => s.Service)
                .WithMany(c => c.Appointments)
                .HasForeignKey(s => s.ServiceId);

            modelBuilder.Entity<Appointment>()
                .HasOne(s => s.Profissional)
                .WithMany(c => c.Appointments)
                .HasForeignKey(s => s.ProfissionalId);

            modelBuilder.Entity<Appointment>()
                .HasOne(s => s.User)
                .WithMany(c => c.Appointments)
                .HasForeignKey(s => s.UserId);

            modelBuilder.Entity<Profissional>()
               .HasOne(s => s.Category)
               .WithMany(c => c.Profissionals)
               .HasForeignKey(s => s.CategoryId);

            modelBuilder.Entity<ProfissionalHorario>()
               .HasOne(s => s.Profissional)
               .WithMany(c => c.ProfissionalHorarios)
               .HasForeignKey(s => s.ProfissionalId);

            modelBuilder.Entity<Service>()
                .Property(s => s.Price)
                .HasPrecision(18, 2);

        }
    }
}