using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Add
    {
        public class Command : IRequest<Result<PhotoUploadResult>>
        {
            public IFormFile File { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<PhotoUploadResult>>
        {
            private readonly DataContext _context;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _photoAccessor = photoAccessor;
                _context = context;
            }

            public async Task<Result<PhotoUploadResult>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context
                    .Users
                    .Include(p => p.Photos)
                    .FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUsername());

                if (user == null) return null;

                var uploadResult = await _photoAccessor.AddPhoto(request.File);
                if (uploadResult == null) return Result<PhotoUploadResult>.Failure("Failed to upload photo");

                var photo = new Photo
                {
                    Id = uploadResult.PublicId,
                    Url = uploadResult.Url,
                    IsMain = false
                };

                if (!user.Photos.Any(photo => photo.IsMain))
                    photo.IsMain = true;

                user.Photos.Add(photo);
                bool result = await _context.SaveChangesAsync() > 0;

                if (result)
                    return Result<PhotoUploadResult>.Success(uploadResult);
                return Result<PhotoUploadResult>.Failure("Failed to save photo in DB");
            }
        }
    }
}