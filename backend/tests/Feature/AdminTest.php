<?php

namespace Tests\Feature;

use App\Models\Job;
use App\Models\Proposal;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        try {
            // Create an admin user
            $this->admin = User::factory()->create(['role' => 'admin']);
            $this->user = User::factory()->create(['role' => 'client']);
            $this->job = Job::create([
                'client_id' => $this->user->id,
                'title' => 'Test Job',
                'description' => 'Test Description',
                'location' => 'Test Location',
                'is_remote' => true,
                'budget' => '100',
                'status' => 'open'
            ]);
            $this->proposal = Proposal::create([
                'job_id' => $this->job->id,
                'provider_id' => $this->user->id,
                'description' => 'Test Proposal',
                'price' => 100,
                'status' => 'pending'
            ]);
        } catch (\Throwable $e) {
            file_put_contents('test_error.log', $e->getMessage() . "\n" . $e->getTraceAsString());
            throw $e;
        }
    }

    public function test_admin_can_get_stats()
    {
        $response = $this->actingAs($this->admin)->getJson('/api/admin/stats');
        $response->assertStatus(200)
            ->assertJsonStructure(['users_count', 'jobs_count', 'proposals_count']);
    }

    public function test_admin_can_get_users()
    {
        $response = $this->actingAs($this->admin)->getJson('/api/admin/users');
        $response->assertStatus(200);
    }

    public function test_admin_can_delete_user()
    {
        $userToDelete = User::factory()->create();
        $response = $this->actingAs($this->admin)->deleteJson('/api/admin/users/' . $userToDelete->id);
        $response->assertStatus(200);
        $this->assertDatabaseMissing('users', ['id' => $userToDelete->id]);
    }

    public function test_admin_can_get_jobs()
    {
        $response = $this->actingAs($this->admin)->getJson('/api/admin/jobs');
        $response->assertStatus(200);
    }

    public function test_admin_can_update_job_status()
    {
        $response = $this->actingAs($this->admin)->putJson('/api/admin/jobs/' . $this->job->id . '/status', ['status' => 'completed']);
        $response->assertStatus(200);
        $this->assertDatabaseHas('jobs', ['id' => $this->job->id, 'status' => 'completed']);
    }

    public function test_admin_can_delete_job()
    {
        $response = $this->actingAs($this->admin)->deleteJson('/api/admin/jobs/' . $this->job->id);
        $response->assertStatus(200);
        $this->assertDatabaseMissing('jobs', ['id' => $this->job->id]);
    }

    public function test_admin_can_get_proposals()
    {
        $response = $this->actingAs($this->admin)->getJson('/api/admin/proposals');
        $response->assertStatus(200);
    }

    public function test_admin_can_delete_proposal()
    {
        $response = $this->actingAs($this->admin)->deleteJson('/api/admin/proposals/' . $this->proposal->id);
        $response->assertStatus(200);
        $this->assertDatabaseMissing('proposals', ['id' => $this->proposal->id]);
    }

    public function test_admin_can_manage_content()
    {
        // create content
        \App\Models\ContentPage::create([
            'page_key' => 'faq',
            'title' => 'FAQ',
            'content' => 'Original',
            'status' => 'published'
        ]);

        $response = $this->actingAs($this->admin)->getJson('/api/admin/content/faq');
        $response->assertStatus(200)->assertJsonFragment(['page_key' => 'faq', 'content' => 'Original']);

        $response = $this->actingAs($this->admin)->putJson('/api/admin/content/faq', ['content' => 'Updated', 'status' => 'published']);
        $response->assertStatus(200)->assertJsonFragment(['message' => 'Content updated']);
        $this->assertDatabaseHas('content_pages', ['page_key' => 'faq', 'content' => 'Updated']);
    }

    public function test_admin_cannot_delete_admin_user()
    {
        $anotherAdmin = User::factory()->create(['role' => 'admin']);
        $response = $this->actingAs($this->admin)->deleteJson('/api/admin/users/' . $anotherAdmin->id);
        $response->assertStatus(403);
        $this->assertDatabaseHas('users', ['id' => $anotherAdmin->id]);
    }
}
