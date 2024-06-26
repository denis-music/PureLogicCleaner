using Microsoft.OpenApi.Models;
using pureLogicCleanerAPI.Mapper;
using pureLogicCleanerAPI.Extenssions;
using pureLogicCleanerAPI.LoggerService;
using pureLogicCleanerAPI.Services;
using pureLogicCleanerAPI.Repository;

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
            builder.Services.AddTransient<ICosmosDBRepo, CosmosDBRepo>();
            builder.Services.AddTransient<ISubscirptionsService, SubscirptionsService>();
            //JWT
            builder.Services.ConfigureJWT(builder.Configuration);

            // Add AutoMapper
            builder.Services.AddAutoMapper(typeof(AutoMapperProfiles));

            // Services
            builder.Services.AddScoped<IUserService, UserService>();
            //builder.Services.AddScoped<ISubscirptionsService, SubscirptionsService>();
            builder.Services.AddSingleton<ILoggerManager, LoggerManager>();


            var app = builder.Build();

            //Global exception handler
            var logger = app.Services.GetRequiredService<ILoggerManager>();
            app.ConfigureExceptionHandler(logger);

            if (app.Environment.IsProduction())
                app.UseHsts();

            var iCosmosDBRepo = app.Services.GetService<ICosmosDBRepo>();
            var iSubsService = app.Services.GetService<ISubscirptionsService>();
            iCosmosDBRepo?.SetAsync();
            iSubsService?.SyncSubsInDB();
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
