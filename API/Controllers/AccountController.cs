using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly TokenService _tokenService;

        public AccountController(UserManager<AppUser> userManager, TokenService tokenService)
        {
            _tokenService = tokenService;
            _userManager = userManager;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user is null) return Unauthorized();

            bool isCorrectPassword = await _userManager.CheckPasswordAsync(user, loginDto.Password);
            if (!isCorrectPassword) return Unauthorized();

            return Ok(GetUser(user));
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto registerDto)
        {
            if (await _userManager.Users.AnyAsync(user => user.UserName == registerDto.Username))
                return BadRequest("User with username already exists");
            if (await _userManager.Users.AnyAsync(user => user.Email == registerDto.Email))
                return BadRequest("User with email already exists");

            var user = new AppUser
            {
                Email = registerDto.Email,
                DisplayName = registerDto.DisplayName,
                UserName = registerDto.Username
            };
            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (result.Succeeded)
                return Ok(GetUser(user));

            return BadRequest(result.Errors);
        }

        private UserDto GetUser(AppUser user)
        {
            return new UserDto
            {
                DisplayName = user.DisplayName,
                Username = user.UserName,
                Token = _tokenService.CreateToken(user),
                Image = null,
            };
        }
    }
}