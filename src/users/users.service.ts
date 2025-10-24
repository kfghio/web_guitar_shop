import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Profile } from './entities/profile.entity';
import { Role } from './entities/role.entity';
import { EventsService } from '../events/events.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FirebaseService } from '../auth/firebase.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private readonly eventsService: EventsService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const roleName = createUserDto.role?.name || 'user';
    const role = await this.roleRepository.findOne({
      where: { name: roleName },
    });
    if (!role) throw new BadRequestException('Role not found');
    const firebaseUser = await this.firebaseService.admin.auth().createUser({
      email: createUserDto.email,
      password: createUserDto.password,
    });
    await this.firebaseService.admin
      .auth()
      .setCustomUserClaims(firebaseUser.uid, {
        role: role,
      });
    const profile = this.profileRepository.create({
      firstName: 'John',
      lastName: 'Doe',
    });
    await this.profileRepository.save(profile);

    const user = this.userRepository.create({
      email: createUserDto.email,
      password: createUserDto.password,
      firebaseUid: firebaseUser.uid,
      role,
      profile,
    });

    return this.userRepository.save(user);
  }

  async findByFirebaseUid(firebaseUid: string): Promise<User> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return this.userRepository.findOne({
      where: { firebaseUid },
      relations: ['role'],
    });
  }
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile', 'role'],
    });

    if (!user) throw new NotFoundException('User not found');

    if (updateUserDto.profile) {
      if (!user.profile) {
        throw new NotFoundException('User profile not found');
      }
      await this.profileRepository.update(
        user.profile.id,
        updateUserDto.profile,
      );
    }

    if (updateUserDto.role) {
      await this.roleRepository.update(user.role.id, updateUserDto.role);
    }

    if (updateUserDto.email) user.email = updateUserDto.email;
    if (updateUserDto.password) user.password = updateUserDto.password;

    this.eventsService.emitEvent('user-updated', {
      id: user.id,
      email: user.email,
    });

    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['profile', 'role'] });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile', 'role'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    this.eventsService.emitEvent('user-deleted', {
      id: user.id,
      email: user.email,
    });
    await this.userRepository.remove(user);
  }

  async findWithPagination(
    page: number,
    limit: number,
  ): Promise<[User[], number]> {
    return this.userRepository.findAndCount({
      relations: ['profile', 'role'],
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' },
    });
  }
}
