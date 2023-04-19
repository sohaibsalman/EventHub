using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string PublicId { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IPhotoAccessor _photoAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor, IPhotoAccessor photoAccessor)
            {
                _photoAccessor = photoAccessor;
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context
                    .Users
                    .Include(user => user.Photos)
                    .FirstOrDefaultAsync(user => user.UserName == _userAccessor.GetUsername());
                if (user == null) return null;

                var photo = user
                    .Photos
                    .FirstOrDefault(p => p.Id == request.PublicId);
                if (photo is null) return null;
                if (photo.IsMain) return Result<Unit>.Failure("Cannot delete main photo of user");

                var deleteResult = await _photoAccessor.DeletePhoto(request.PublicId);
                if (deleteResult is null) return Result<Unit>.Failure("Error deleting file from Cloudinary");

                user.Photos.Remove(photo);
                bool result = await _context.SaveChangesAsync() > 0;

                if (result) return Result<Unit>.Success(Unit.Value);
                return Result<Unit>.Failure("Error deleting file from DB");
            }
        }
    }
}