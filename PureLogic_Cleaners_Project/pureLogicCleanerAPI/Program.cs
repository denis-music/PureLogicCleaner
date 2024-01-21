using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using pureLogicCleanerAPI.Context;
using pureLogicCleanerAPI.Mapper;
using pureLogicCleanerAPI.Services;
using pureLogicCleanerAPI.Extenssions;

namespace pureLogicCleanerAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title = "PureLogic Cleaner API",
                    Description = "An ASP.NET Core Web API for Cleaning Scheduler.",
                    TermsOfService = new Uri("https://example.com/terms"),
                    Contact = new OpenApiContact
                    {
                        Name = "Contact",
                        Url = new Uri("https://example.com/contact")
                    },
                    License = new OpenApiLicense
                    {
                        Name = "License",
                        Url = new Uri("https://example.com/license")
                    }
                });
            });

            //JWT
            builder.Services.ConfigureJWT(builder.Configuration);

            // Add AutoMapper
            builder.Services.AddAutoMapper(typeof(AutoMapperProfiles));

            // Services
            builder.Services.AddScoped<IUserService, UserService>();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthentication();

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
