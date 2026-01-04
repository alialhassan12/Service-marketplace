<?php

namespace Tests\Feature;

use App\Models\Payment;
use App\Models\User;
use App\Models\Job;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminTransactionsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->client = User::factory()->create(['role' => 'client', 'name' => 'Alice Client']);
        $this->provider = User::factory()->create(['role' => 'provider', 'name' => 'Bob Provider']);
        
        $this->job = Job::create([
             'client_id' => $this->client->id,
             'title' => 'Test Job',
             'description' => 'Desc',
             'location' => 'NY',
             'is_remote' => true,
             'budget' => '200',
             'status' => 'open'
        ]);

        $this->payment = Payment::create([
            'client_id' => $this->client->id,
            'provider_id' => $this->provider->id,
            'job_id' => $this->job->id,
            'amount' => 100.00,
            'currency' => 'USD',
            'status' => 'paid',
            'payment_method' => 'stripe',
            'transaction_id' => 'txn_123456',
            'description' => 'Test Payment'
        ]);
        
        // Create a pending payment
        Payment::create([
            'client_id' => $this->client->id,
            'provider_id' => $this->provider->id,
            'job_id' => $this->job->id,
            'amount' => 50.00,
            'currency' => 'USD',
            'status' => 'pending',
            'payment_method' => 'stripe',
            'transaction_id' => 'txn_pending',
            'description' => 'Pending Payment'
        ]);
    }

    public function test_admin_can_get_transactions()
    {
        $response = $this->actingAs($this->admin)->getJson('/api/admin/transactions');
        $response->assertStatus(200)
                 ->assertJsonStructure(['data', 'current_page', 'total']);
        
        $this->assertEquals(2, $response->json('total'));
    }

    public function test_admin_can_filter_transactions_by_search()
    {
        $response = $this->actingAs($this->admin)->getJson('/api/admin/transactions?search=Alice');
        $response->assertStatus(200);
        $this->assertEquals(2, $response->json('total')); // Both payments are from Alice

        $response = $this->actingAs($this->admin)->getJson('/api/admin/transactions?search=txn_123456');
        $response->assertStatus(200);
        $this->assertEquals(1, $response->json('total'));
    }

    public function test_admin_can_filter_transactions_by_status()
    {
        $response = $this->actingAs($this->admin)->getJson('/api/admin/transactions?status=paid');
        $response->assertStatus(200);
        $this->assertEquals(1, $response->json('total'));
        $this->assertEquals('paid', $response->json('data.0.status'));
    }

    public function test_admin_can_get_transaction_stats()
    {
        $response = $this->actingAs($this->admin)->getJson('/api/admin/transactions/stats');
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'total_volume',
                     'platform_fees',
                     'total_payouts',
                     'pending_transactions'
                 ]);
        
        $data = $response->json();
        $this->assertEquals(100.00, $data['total_volume']['value']);
        $this->assertEquals(50.00, $data['pending_transactions']['value']);
    }

    public function test_admin_can_export_transactions()
    {
        $response = $this->actingAs($this->admin)->get('/api/admin/transactions/export');
        $response->assertStatus(200);
        $response->assertHeader('content-type', 'text/csv; charset=UTF-8');
    }
}
