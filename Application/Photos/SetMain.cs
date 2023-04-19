using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class SetMain
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
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
                var user = await _context
                    .Users
                    .Include(p => p.Photos)
                    .FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUsername());
                if (user is null) return null;

                var photo = user
                    .Photos
                    .FirstOrDefault(x => x.Id == request.Id);
                if (photo is null) return null;
                if (photo.IsMain) return Result<Unit>.Failure("Cannot set already main photo");

                var mainInDb = user.Photos.FirstOrDefault(x => x.IsMain);
                if (mainInDb != null)
                    mainInDb.IsMain = false;
                photo.IsMain = true;

                bool result = await _context.SaveChangesAsync() > 0;
                if (!result)
                    return Result<Unit>.Failure("Error setting the main photo");
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}