using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class UpdateAttendance
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context
                    .Activities
                    .Include(x => x.Attendees)
                    .ThenInclude(u => u.AppUser)
                    .FirstOrDefaultAsync(x => x.Id == request.Id);

                if (activity is null) return null;

                var user = _context
                    .Users
                    .FirstOrDefault(user => user.UserName == _userAccessor.GetUsername());

                if (user is null) return null;

                var hostUsername = activity.Attendees.FirstOrDefault(x => x.IsHost)?.AppUser?.UserName;
                var attendance = activity.Attendees.FirstOrDefault(x => x.AppUser.UserName == user.UserName);

                if (activity != null && hostUsername == user.UserName)
                    activity.IsCancelled = !activity.IsCancelled;

                if (activity != null && hostUsername != user.UserName)
                    activity.Attendees.Remove(attendance);

                if (attendance is null)
                {
                    attendance = new ActivityAttendee
                    {
                        IsHost = false,
                        AppUser = user,
                        Activity = activity
                    };
                    activity.Attendees.Add(attendance);
                }

                var result = await _context.SaveChangesAsync() > 0;

                return result
                    ? Result<Unit>.Success(Unit.Value)
                    : Result<Unit>.Failure("Problem with updating the attendance");
            }
        }
    }
}