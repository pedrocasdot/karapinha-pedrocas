using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Model;

namespace backend.Shared.Repositories
{
    public interface IAppointmentItemRepository
    {
        Task<IEnumerable<AppointmentItem>> GetAllAppointmentsItemsAsync();
        Task<AppointmentItem> GetAppointmentItemByIdAsync(int id);
        Task CreateAppointmentItemAsync(AppointmentItem appointmentItem);
        Task UpdateAppointmentItemAsync(AppointmentItem appointmentItem);
        Task DeleteAppointmentItemAsync(int id);
    }
}